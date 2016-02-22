using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Web.Mvc;
using SampleData.DAL;
using SampleData.Models;
using SampleData.ViewModels;
using SampleData.Helpers;
using System.Diagnostics;
using System.Text.RegularExpressions;

namespace SampleData.Controllers
{    
    public class SampleController : Controller
    {
        private const int MAX_RECS = 30;
        private WardDBContext db = new WardDBContext();
        private SampleResult sr = new SampleResult();

        // GET: SampleModels
        public ActionResult Index()
        {
            return View();
        }

        // GET: SampleModels/Entry
        public ActionResult Entry()
        {         
            return View();
        }

        #region "Helper Functions"
        public JsonResult Load(int sampleTypeNumber = 2)
        {                       
            return Json(GetEntry(sampleTypeNumber), JsonRequestBehavior.AllowGet);
        }
        private Object GetEntry(int stn, SampleModels sample = null)
        {
            GenericInfo gInfo = new GenericInfo();
            if (sample != null)
            {
                Debug.Print("1.sample ! null");
                gInfo = GetGenericInfo(stn, sample);                
            } 
            else
            {
                gInfo = GetGenericInfo(stn);
            }
            
            if (stn == 1 || stn == 14)
            {
                SoilReturn soilReturn = new SoilReturn();
                soilReturn.GenericInfo = gInfo;
                soilReturn.GenericMasters = GetGenericMasters(stn);
                soilReturn.SoilMasters = GetSoilMasters(stn);
                soilReturn.SampleChains = GetSampleChainsList(soilReturn.GenericInfo.Samples);
                soilReturn.TopSoils = GetTopSoils(soilReturn.SampleChains, soilReturn.GenericInfo.Samples);
                soilReturn.Recommendations = GetSampleRecommendations(soilReturn.GenericInfo.Samples);                
                Debug.Print(soilReturn.GenericInfo.Samples.First().LabNumber.ToString());
                return soilReturn;
            }
            else if (stn == 2 || stn == 3 || stn == 4 || stn == 5 || stn == 6 || stn == 7 || stn == 9 || stn == 12)
            {
                SubSampleReturn subSampleReturn = new SubSampleReturn();
                subSampleReturn.GenericInfo = gInfo;
                subSampleReturn.GenericMasters = GetGenericMasters(stn);
                subSampleReturn.SubSampleTypes = GetSubSampleTypes(stn);
                subSampleReturn.SubSampleInfos = GetSubSampleInfos(subSampleReturn.GenericInfo.Samples);
                subSampleReturn.SubSampleTypes = GetSubSampleTypes(stn);

                return subSampleReturn;
            }
            else if (stn == 5)
            {
                PlantReturn plant = new PlantReturn();
                plant.GenericInfo = gInfo;
                plant.GenericMasters = GetGenericMasters(stn);
                plant.SubSampleTypes = GetSubSampleTypes(stn);
                plant.SubSampleInfos = GetSubSampleInfos(plant.GenericInfo.Samples);
                plant.SubSampleTypes = GetSubSampleTypes(stn);
                plant.SubSubSampleTypes = GetSubSubSampleTypes(stn);

                return plant;
            }
            else
            {
                OtherReturn otherReturn = new OtherReturn();
                otherReturn.GenericInfo = gInfo;
                otherReturn.GenericMasters = GetGenericMasters(stn);

                return otherReturn;
            }
        }
        private SampleModels GetSample(int stn, int bn = 0, int ln = 0)
        {
            try
            {
                if (bn == 0 && ln == 0)
                {
                    return (from s in db.Samples
                            where s.SampleTypeNumber == stn
                            orderby s.BatchNumber descending, s.LabNumber descending
                            select s).FirstOrDefault();
                }
                else if (ln != 0)
                {
                    return (from s in db.Samples
                            where s.SampleTypeNumber == stn && s.LabNumber >= ln
                            select s).SingleOrDefault();
                }
                else
                {
                    return (from s in db.Samples
                            where s.SampleTypeNumber == stn && s.BatchNumber == bn && s.LabNumber == ln
                            select s).SingleOrDefault();
                }
            }
            catch (Exception e)
            {
                sr.Message.Add(e.Source);
                Debug.Print(e.StackTrace);
                return null;
            }            
        }
        private List<SampleViewModel> GetSamples(int stn, SampleModels sample = null)
        {
            try
            {
                List<SampleModels> samples = new List<SampleModels>();
                if (sample == null)
                {
                    samples = (from s in db.Samples
                               where s.SampleTypeNumber == stn
                               orderby s.BatchNumber descending, s.LabNumber descending
                               select s).Take(MAX_RECS).ToList();
                }
                else
                {
                    Debug.Print("3.sample ! null");
                    samples = (from s in db.Samples
                               where s.SampleTypeNumber == stn && s.BatchNumber >= sample.BatchNumber && s.LabNumber >= sample.LabNumber
                               orderby s.LabNumber, s.BatchNumber descending
                               select s).Take(MAX_RECS).ToList();
                }
                Debug.Print("Printing 30 samples");
                foreach (SampleModels s in samples)
                {
                    Debug.Print("labnumber: " + s.LabNumber);
                }
                Debug.Print("End Printing Samples");
                return ConvertSamples(samples);
            }
            catch (Exception e)
            {
                sr.Message.Add(e.Source);
                Debug.Print(e.StackTrace);
                return null;
            }            
        }
        private List<SampleViewModel> ConvertSamples(List<SampleModels> samples)
        {
            try
            {
                List<SampleViewModel> sampleViews = new List<SampleViewModel>();
                foreach (SampleModels s in samples)
                {
                    SampleViewModel sample = CreateSampleView(s);
                    InvoiceModels invoice = GetInvoice(sample.AccountNumber, sample.BatchNumber, sample.SampleTypeNumber);
                    if (invoice != null)
                    {
                        sample.InvoiceNumber = invoice.InvoiceNumber;
                        sample.DateReported = invoice.DateReported;
                    }

                    ReportModels report = GetReport(sample.SampleTypeNumber, sample.ReportTypeNumber);
                    if (report != null)
                    {
                        sample.ReportTypeNumber = report.ReportTypeNumber;
                        sample.ReportCost = GetReportCost(sample.SampleTypeNumber, sample.CostTypeNumber, sample.ReportTypeNumber);
                        sample.ReportName = GetReportName(sample.SampleTypeNumber, sample.ReportTypeNumber);
                    }
                    sampleViews.Add(sample);
                }
                return sampleViews;
            }
            catch (Exception e)
            {
                sr.Message.Add(e.Source);
                Debug.Print(e.StackTrace);
                return null;
            }            
        }
        private List<AccountViewModel> GetAccounts(List<SampleViewModel> samples)
        {
            try
            {
                List<AccountViewModel> accountViews = new List<AccountViewModel>();
                foreach (SampleViewModel s in samples)
                {
                    AccountViewModel account = CreateAccountView(s.AccountNumber, s.SampleTypeNumber);
                    accountViews.Add(account);
                }
                return accountViews;
            }
            catch (Exception e)
            {
                sr.Message.Add(e.Source);
                Debug.Print(e.StackTrace);
                return null;
            }            
        }
        private SampleViewModel CreateSampleView(SampleModels sample)
        {
            SampleViewModel sampleView = new SampleViewModel();            
            sampleView.SampleTypeNumber = sample.SampleTypeNumber;
            sampleView.AccountNumber = sample.AccountNumber;
            sampleView.BatchNumber = sample.BatchNumber;
            sampleView.LabNumber = sample.LabNumber;
            sampleView.Grower = sample.Grower;
            sampleView.ReportTypeNumber = sample.ReportTypeNumber;
            sampleView.ReportCost = sample.ReportCost;
            sampleView.DateReceived = sample.DateReceived;
            sampleView.DateReported = sample.DateReported;
            sampleView.SampleID1 = sample.SampleID1;
            sampleView.SampleID2 = sample.SampleID2;
            sampleView.SampleID3 = sample.SampleID3;
            sampleView.SampleID4 = sample.SampleID4;
            sampleView.SampleID5 = sample.SampleID5;
            sampleView.InvoiceNumber = sample.InvoiceNumber;
            sampleView.CostTypeNumber = sample.CostTypeNumber;
            return sampleView;
        }
        private AccountViewModel CreateAccountView(int an, int stn)
        {
            try
            {
                AccountViewModel avm = new AccountViewModel();
                AccountModels am = (from a in db.Accounts
                                    where a.AccountNumber == an
                                    select a).SingleOrDefault();
                avm.Name = am.FirstName + " " + am.LastName;
                avm.Company = am.Company;
                avm.Address1 = am.Address1;
                avm.CityStZip = am.City + ", " + am.State + " " + am.Zip;
                avm.SampleEntryInformation = am.SampleEntryInformation;
                avm.Growers = GetGrowers(an, stn);
                return avm;
            }
            catch (Exception e)
            {
                sr.Message.Add(e.Source);
                Debug.Print(e.StackTrace);
                return null;
            }
            
        }
        private GenericInfo GetGenericInfo(int stn, SampleModels sample = null)
        {
            GenericInfo gInfo = new GenericInfo();
            if (sample == null)
            {
                gInfo.Samples = GetSamples(stn);
            }
            else
            {
                Debug.Print("2.sample ! null");
                gInfo.Samples = GetSamples(stn, sample);
            }
            
            gInfo.Accounts = GetAccounts(gInfo.Samples);
            gInfo.Messages = GetMessages();
            return gInfo;
        }
        private GenericMasters GetGenericMasters(int stn)
        {
            GenericMasters gMaster = new GenericMasters();
            gMaster.SampleTypes = GetSampleTypes();
            gMaster.SampleColumns = GetSampleColumns(stn);
            return gMaster;

        }
        private SoilMasters GetSoilMasters(int stn)
        {
            SoilMasters sMaster = new SoilMasters();

            List<SoilRecCropModels> soilRecCrops = GetSoilRecCrops();
            sMaster.CropTypes = new List<string>();
            foreach (SoilRecCropModels rc in soilRecCrops)
            {
                var crop = rc.CropTypeNumber.ToString() + " - " + rc.CropTypeName;
                if (rc.Unit != null)
                {
                    crop = crop + ":" + rc.Unit;
                }
                sMaster.CropTypes.Add(crop);
            }

            List<SoilRecTypeModels> soilRecTypes = new List<SoilRecTypeModels>();
            if (stn == 1)
            {
                soilRecTypes = GetSoilRecTypes();
                sMaster.RecTypes = new List<string>();
                foreach (SoilRecTypeModels rt in soilRecTypes)
                {
                    sMaster.RecTypes.Add(rt.RecTypeNumber.ToString() + " - " + rt.RecTypeName);
                }
            }
            sMaster.PastCrops = GetPastCrops();

            return sMaster;
        }
        private SampleChainModels GetSampleChain(int bn, int ln)
        {
            try
            {
                SampleChainModels sChain = new SampleChainModels();
                sChain = (from ss in db.SampleChains
                          where (ss.BatchNumber == bn && ss.LabNumber == ln)
                          orderby ss.BeginningDepth ascending
                          select ss).FirstOrDefault();
                return sChain;
            }
            catch (Exception e)
            {
                sr.Message.Add(e.Source);
                Debug.Print(e.StackTrace);
                return null;
            }
            
        }
        private List<SoilRecTypeModels> GetSoilRecTypes()
        {
            try
            {
                return (from y in db.SoilRecTypes
                        where y.RecTypeName != "HANEY"
                        orderby y.RecTypeNumber
                        select y).ToList();
            }
            catch (Exception e)
            {
                sr.Message.Add(e.Source);
                Debug.Print(e.StackTrace);
                return null;
            }
            
        }
        private List<SoilRecCropModels> GetSoilRecCrops()
        {
            try
            {
                return (from x in db.SoilRecCrops
                        orderby x.CropTypeNumber
                        select x).ToList();
            }
            catch (Exception e)
            {
                sr.Message.Add(e.Source);
                Debug.Print(e.StackTrace);
                return null;
            }            
        }
        private List<List<SampleChainModels>> GetSampleChainsList(List<SampleViewModel> samples)
        {
            try
            {
                List<List<SampleChainModels>> sampleChainsList = new List<List<SampleChainModels>>();
                foreach (SampleViewModel s in samples)
                {
                    List<SampleChainModels> sChains = new List<SampleChainModels>();
                    SampleChainModels sChain = new SampleChainModels();
                    sChain = GetSampleChain(s.BatchNumber, s.LabNumber);

                    // Check in sample is linked - if so, get linked samples
                    if (sChain != null)
                    {
                        if (sChain.LinkedSampleLab == 0)
                        {
                            sChains = (from ss in db.SampleChains
                                       where (ss.BatchNumber == s.BatchNumber && ss.LabNumber == s.LabNumber || (ss.LinkedSampleBatch == s.BatchNumber && ss.LinkedSampleLab == s.LabNumber))
                                       orderby ss.BeginningDepth ascending
                                       select ss).ToList();
                        }
                        else
                        {
                            sChains = (from ss in db.SampleChains
                                       where (ss.BatchNumber == sChain.LinkedSampleBatch && ss.LabNumber == sChain.LinkedSampleLab) || (ss.LinkedSampleBatch == sChain.LinkedSampleBatch && ss.LinkedSampleLab == sChain.LinkedSampleLab)
                                       orderby ss.BeginningDepth ascending
                                       select ss).ToList();
                        }
                        sampleChainsList.Add(sChains);
                    }
                }
                return sampleChainsList;
            }
            catch (Exception e)
            {
                sr.Message.Add(e.Source);
                Debug.Print(e.StackTrace);
                return null;
            }            
        }
        private List<List<int>> GetTopSoils(List<List<SampleChainModels>> sChainsList, List<SampleViewModel> samples)
        {
            try
            {
                List<List<int>> topSoilsList = new List<List<int>>();
                int i = 0;
                foreach (List<SampleChainModels> sChains in sChainsList)
                {
                    //Debug.Print(samples[i].LabNumber.ToString());
                    List<int> topSoils = new List<int>();
                    var xyz = (from xx in sChains
                               where xx.BatchNumber == samples[i].BatchNumber && xx.LabNumber == samples[i].LabNumber
                               select xx).SingleOrDefault();
                    if (xyz.TopSoil == 0)
                    {
                        var bn = samples[i].BatchNumber;
                        var an = samples[i].AccountNumber;
                        topSoils = (from ss in db.SampleChains
                                    join sx in db.Samples on ss.LabNumber equals sx.LabNumber
                                    where sx.BatchNumber == bn && sx.AccountNumber == an && ss.TopSoil == 1
                                    select ss.LabNumber).ToList();
                    }
                    topSoilsList.Add(topSoils);
                    i++;
                }
                return topSoilsList;
            }
            catch (Exception e)
            {
                sr.Message.Add(e.Source);
                Debug.Print(e.StackTrace);
                return null;
            }
            
        }
        private List<List<SoilRecViewModel>> GetSampleRecommendations(List<SampleViewModel> samples)
        {
            int stn = samples.First().SampleTypeNumber;

            List<List<SoilRecViewModel>> recommendationsList = new List<List<SoilRecViewModel>>();

            foreach (SampleViewModel s in samples)
            {
                List<SoilRecModels> soilSampleRecs = GetSoilRecs(s.BatchNumber, s.LabNumber);
                List<SoilRecViewModel> soilViews = new List<SoilRecViewModel>();
                foreach (SoilRecModels r in soilSampleRecs)
                {
                    SoilRecViewModel rec = new SoilRecViewModel();
                    rec.BatchNumber = r.BatchNumber;
                    rec.LabNumber = r.LabNumber;
                    rec.Priority = r.Priority;
                    rec.RecTypeNumber = r.RecTypeNumber;
                    rec.CropTypeNumber = r.CropTypeNumber;
                    rec.YieldGoal = r.YieldGoal;
                    if (stn == 14)
                    {
                        rec.RecTypeName = "4 - Haney";
                        rec.RecTypeNumber = 4;
                    }
                    else
                    {
                        var query1 = GetSoilRecTypes();
                        rec.RecTypeName = rec.RecTypeNumber + " - " + (from x in query1
                                                                       where x.RecTypeNumber == rec.RecTypeNumber
                                                                       select x.RecTypeName).SingleOrDefault();
                    }
                    var query2 = GetSoilRecCrops();
                    var src = (from y in query2
                               where y.CropTypeNumber == rec.CropTypeNumber
                               select y).SingleOrDefault();

                    rec.CropTypeName = rec.CropTypeNumber + " - " + src.CropTypeName + ":" + src.Unit;
                    soilViews.Add(rec);
                }
                recommendationsList.Add(soilViews);
            }
            //foreach (List<SoilRecViewModel> svs in recommendationsList)
            //{
            //    Debug.Print("---------------------------");
            //    foreach (SoilRecViewModel sv in svs)
            //    {
            //        Debug.Print(sv.ToString());
            //    }
            //}
            return recommendationsList;
        }
        public JsonResult FindAccount(int an, int stn)
        {
            AccountModels account = new AccountModels();
            
            if (AccountExist(an))
            {
                account = GetAccount(an);
                if (account != null)
                {
                    AccountViewModel accountView = new AccountViewModel();
                    accountView.Name = account.FirstName + " " + account.LastName;
                    accountView.Company = account.Company;
                    accountView.Address1 = account.Address1;
                    accountView.CityStZip = account.City + ", " + account.State + " " + account.Zip;
                    accountView.SampleEntryInformation = account.SampleEntryInformation;
                    accountView.Growers = GetGrowers(an, stn);
                    return Json(accountView, JsonRequestBehavior.AllowGet);
                }                               
            }
            return Json(null, JsonRequestBehavior.AllowGet);
        }        
        public JsonResult GetColumns(int stn)
        {       
            return Json(GetSampleColumns(stn), JsonRequestBehavior.AllowGet);
        }        
        public string GetReportName(int sampleTypeNumber, int reportTypeNumber)
        {
            if (Validator.isNumeric(sampleTypeNumber.ToString()) && Validator.isNumeric(reportTypeNumber.ToString()))
            {
                try
                {
                    ReportModels report = (from r in db.Reports
                                           where r.SampleTypeNumber == sampleTypeNumber && r.ReportTypeNumber == reportTypeNumber
                                           select r).SingleOrDefault();
                    if (report != null)
                    {
                        return report.ReportName;
                    }
                }
                catch (Exception e)
                {
                    Debug.Print(e.ToString());
                }
            }
            return null;
        }
        public JsonResult GetGrower(int accountNumber, int sampleTypeNumber)
        {
            if (Validator.isNumeric(accountNumber.ToString()) && Validator.isNumeric(sampleTypeNumber.ToString()))
            {
                return Json(GetGrowers(accountNumber, sampleTypeNumber), JsonRequestBehavior.AllowGet);           
            }
            else
                return null;
        }
        public List<SampleTypeModels> GetSampleTypes()
        {
            try
            {
                return db.SampleTypes.ToList();
            }
            catch (Exception e)
            {
                sr.Message.Add(e.Source);
                Debug.Print(e.StackTrace);
                return null;
            }            
        }
        public JsonResult LoadSampleTypes()
        {
            try
            {
                return Json(db.SampleTypes.ToList(), JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                sr.Message.Add(e.Source);
                Debug.Print(e.StackTrace);
                return null;
            }
        }
        public JsonResult GetReportItems(int sampleTypeNumber)
        {
            try
            {
                List<ReportItemModels> reportItems = (from ri in db.ReportItems
                                                      where ri.SampleTypeNumber == sampleTypeNumber
                                                      orderby ri.ReportItemName
                                                      select ri).ToList();

                return Json(reportItems, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                sr.Message.Add(e.Source);
                Debug.Print(e.StackTrace);
                return null;
            }
            
        }
        private bool SampleExist(int stn, int bn, int ln)
        {
            try
            {
                SampleModels s = db.Samples.Find(stn, bn, ln);
                if (s != null)
                {
                    return true;
                }
                return false;
            }
            catch (Exception e)
            {
                sr.Message.Add(e.Source);
                Debug.Print(e.StackTrace);
                return false;
            }            
        }
        private List<SoilRecModels> GetSoilRecs(int bn, int ln)
        {
            try
            {
                return (from ssr in db.SoilRecs
                        where ssr.BatchNumber == bn && ssr.LabNumber == ln
                        orderby ssr.Priority
                        select ssr).ToList();
            }
            catch (Exception e)
            {
                sr.Message.Add(e.Source);
                Debug.Print(e.StackTrace);
                return null;
            }            
        }
        private SampleModels ConvertToUpperCase(SampleModels sample)
        {
            sample.Grower = sample.Grower.ToUpper();
            sample.SampleID1 = sample.SampleID1.ToUpper();
            sample.SampleID2 = sample.SampleID2.ToUpper();
            if (Validator.isPresent(sample.SampleID3))
            {
                sample.SampleID3 = sample.SampleID3.ToUpper();
            }
            if (Validator.isPresent(sample.SampleID4))
            {
                sample.SampleID4 = sample.SampleID4.ToUpper();
            }
            if (Validator.isPresent(sample.SampleID5))
            {
                sample.SampleID5 = sample.SampleID5.ToUpper();
            }
            return sample;
        }
        private List<SampleColumns> GetSampleColumns(int stn)
        {
            try
            {
                return (from sc in db.SampleColumns
                        where sc.SampleTypeNumber == stn
                        orderby sc.ColumnOrder
                        select sc).ToList();
            }
            catch (Exception e)
            {
                sr.Message.Add(e.Source);
                Debug.Print(e.StackTrace);
                return null;
            }            
        }
        public JsonResult LoadSampleColumns()
        {
            try
            {
                var x = (from sc in db.SampleColumns
                        orderby sc.ColumnOrder
                        select sc).ToList();
                return Json(x, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                sr.Message.Add(e.Source);
                Debug.Print(e.StackTrace);
                return null;
            }
        }
        private ReportModels GetReport(int stn, int rtn)
        {
            try
            {
                ReportModels report = new ReportModels();
                report = (from r in db.Reports
                          where r.SampleTypeNumber == stn & r.ReportTypeNumber == rtn
                          select r).FirstOrDefault();
                return report;
            }
            catch (Exception e)
            {
                sr.Message.Add(e.Source);
                Debug.Print(e.StackTrace);
                return null;
            }            
        }
        private double GetReportCost(int stn, int ctn, int rtn)
        {
            ReportModels report = GetReport(stn, rtn);
            if (ctn == 1) {
                return report.StandardCost;
            } else if (ctn == 2) {
                return report.PrimaryVolumeCost;
            } else {
                return 0.0;
            }
        }
        private bool ReportTypeExist(int stn, int rtn)
        {
                ReportModels report = GetReport(stn, rtn);
            if (report != null)
                return true;
            else
                return false;
        }
        public List<string> GetGrowers(int cn, int stn)
        {
            try
            {
                return (from g in db.Samples
                        where g.AccountNumber == cn && g.SampleTypeNumber == stn
                        select g.Grower).Distinct().ToList();
            }
            catch (Exception e)
            {
                sr.Message.Add(e.Source);
                Debug.Print(e.StackTrace);
                return null;
            }
            
        }
        private InvoiceModels GetInvoice(int inv)
        {
            try
            {
                InvoiceModels invoice = (from i in db.Invoices
                                         where i.InvoiceNumber == inv
                                         select i).SingleOrDefault();
                return invoice;
            }
            catch (Exception e)
            {
                sr.Message.Add(e.Source);
                Debug.Print(e.StackTrace);
                return null;
            }            
        }
        private List<InvoiceViewModel> GetInvoices(List<SampleViewModel> samples)
        {
            List<InvoiceViewModel> invoices = new List<InvoiceViewModel>();
            foreach (var s in samples)
            {
                InvoiceModels invoice = GetInvoice(s.InvoiceNumber);
                InvoiceViewModel iView = new InvoiceViewModel();
                iView.InvoiceNumber = invoice.InvoiceNumber;
                iView.SampleTypeNumber = invoice.SampleTypeNumber;
                iView.BatchNumber = invoice.BatchNumber;
                iView.AccountNumber = invoice.AccountNumber;
                iView.BatchNumber = invoice.BatchNumber;
                invoices.Add(iView);
            }
            return invoices;
        }
        private InvoiceModels GetInvoice(int cn, int bn, int stn)
        {
            try
            {
                InvoiceModels invoice = (from inv in db.Invoices
                                         where inv.BatchNumber == bn && inv.AccountNumber == cn && inv.SampleTypeNumber == stn
                                         select inv).FirstOrDefault();
                return invoice;
            }
            catch (Exception e)
            {
                sr.Message.Add(e.Source);
                Debug.Print(e.StackTrace);
                return null;
            }                    
        }
        private InvoiceModels CreateInvoice(SampleModels sample)
        {
            try
            {
                int maxInvoice = (from i in db.Invoices
                                  orderby i.InvoiceNumber descending
                                  select i.InvoiceNumber).FirstOrDefault();
                InvoiceModels newInvoice = new InvoiceModels();
                newInvoice.InvoiceNumber = maxInvoice + 1;
                newInvoice.SampleTypeNumber = sample.SampleTypeNumber;
                newInvoice.BatchNumber = sample.BatchNumber;
                newInvoice.AccountNumber = sample.AccountNumber;
                newInvoice.DateReported = new DateTime(Convert.ToInt32(sample.BatchNumber.ToString().Substring(0, 4)), Convert.ToInt32(sample.BatchNumber.ToString().Substring(4, 2)), Convert.ToInt32(sample.BatchNumber.ToString().Substring(6, 2)));
                newInvoice.Comments = "0";
                newInvoice.Locked = 0;
                newInvoice.PostageCost = 0.0;

                AccountModels account = db.Accounts.Find(sample.AccountNumber);
                newInvoice.AccountDiscount = account.Discount;
                
                return newInvoice;
            }
            catch (Exception e)
            {
                sr.Message.Add(e.Source);
                Debug.Print(e.StackTrace);
                return null;
            }                         
        }
        private int GetLabNumber(int stn, int bn)
        {
            try
            {
                string bnYear = bn.ToString().Substring(0, 4);
                string bnMMDD = Regex.Replace(bn.ToString().Substring(4, 4), "[1-9]", "0");
                int bnTmp = Convert.ToInt32(String.Concat(bnYear, bnMMDD));
                int labNumber = (from s in db.Samples
                                 where s.BatchNumber > bnTmp
                                 orderby s.LabNumber descending
                                 select s.LabNumber).FirstOrDefault();
                return labNumber + 1;
            }
            catch (Exception e)
            {
                sr.Message.Add(e.Source);
                Debug.Print(e.StackTrace);
                return 0;
            }            
        }
        private bool LabNumberExists(int stn, int bn, int ln)
        {
            try
            {
                string bnYear = bn.ToString().Substring(0, 4);
                int bnTmp = Convert.ToInt32(String.Concat(bnYear, 0000));
                Debug.Print(bnTmp.ToString());
                SampleModels sample = (from s in db.Samples
                                       where s.SampleTypeNumber == stn && s.BatchNumber > bnTmp && s.LabNumber == ln
                                       select s).SingleOrDefault();
                if (sample != null)
                    return true;
                else
                    return false;
            }
            catch (Exception e)
            {
                sr.Message.Add(e.Source);
                Debug.Print(e.StackTrace);
                return false;
            }
                      
        }
        private AccountModels GetAccount(int an)
        {
            try
            {
                return (from acc in db.Accounts
                        where acc.AccountNumber == an
                        select acc).SingleOrDefault();
            }
            catch (Exception e)
            {
                sr.Message.Add(e.Source);
                Debug.Print(e.StackTrace);
                return null;
            }                 
        }
        private bool AccountExist(int an)
        {
            AccountModels account = GetAccount(an);
            if (account != null)
                return true;
            else
                return false;
        }
        private List<PastCropModels> GetPastCrops()
        {
            try
            {
                return db.PastCrops.ToList();
            }
            catch (Exception e)
            {
                sr.Message.Add(e.Source);
                Debug.Print(e.StackTrace);
                return null;
            }            
        }
        public JsonResult GetReportList(int stn, string[] rins)
        {
            Debug.Print("STN: " + stn);
            foreach (var x in rins)
            {
                Debug.Print("ReportItemNumber: " + x);
            }
            try
            {
                //List<ReportModels> reports = (from r in db.Reports
                //                              where r.SampleTypeNumber = stn && r.ReportTypeNumber ==
                //                              select r).ToList();
                //return Json(reports, JsonRequestBehavior.AllowGet);
                return null;
            }
            catch (Exception e)
            {
                sr.Message.Add(e.Source);
                Debug.Print(e.StackTrace);
                return null;
            }                        
        }
        private SubSampleInfoModels GetSubSampleInfo(int stn, int bn, int ln)
        {
            try
            {
                return (from ssi in db.SubSampleInfo
                        where ssi.SampleTypeNumber == stn && ssi.BatchNumber == bn && ssi.LabNumber == ln
                        select ssi).SingleOrDefault();
            }
            catch (Exception e)
            {
                sr.Message.Add(e.Source);
                Debug.Print(e.StackTrace);
                return null;
            }            
        }
        private List<SubSampleInfoModels> GetSubSampleInfos(List<SampleViewModel> samples)
        {
            try
            {
                List<SubSampleInfoModels> subSampleInfoModels = new List<SubSampleInfoModels>();
                foreach (var s in samples)
                {
                    var x = (from ssi in db.SubSampleInfo
                             where ssi.SampleTypeNumber == s.SampleTypeNumber && ssi.BatchNumber == s.BatchNumber && ssi.LabNumber == s.LabNumber
                             select ssi).SingleOrDefault();
                    subSampleInfoModels.Add(x);
                }
                return subSampleInfoModels;
            }
            catch (Exception e)
            {
                sr.Message.Add(e.Source);
                Debug.Print(e.StackTrace);
                return null;
            }            
        }
        private List<SubSampleTypeModels> GetSubSampleTypes(int stn)
        {
            try
            {
                return (from sst in db.SubSampleTypes
                        where sst.SampleTypeNumber == stn
                        select sst).ToList();
            }
            catch (Exception e)
            {
                sr.Message.Add(e.Source);
                Debug.Print(e.StackTrace);
                return null;
            }            
        }
        public List<List<SubSubSampleTypeModels>> GetSubSubSampleTypes(int stn)
        {
            try
            {
                List<List<SubSubSampleTypeModels>> subSubSampleTypesList = new List<List<SubSubSampleTypeModels>>();
                return subSubSampleTypesList;
            }
            catch (Exception e)
            {
                sr.Message.Add(e.Source);
                Debug.Print(e.StackTrace);
                return null;
            }            
        }
        private List<string> GetMessages()
        {
            return sr.Message;
        }
        #endregion
        #region "Find Sample"
        public JsonResult FindSample(int sampleTypeNumber, int labNumber, int batchNumber = 0)
        {
            Debug.Print("FindSample....");
            if (batchNumber == 0)
            {
                Debug.Print("Batchnumber == 0");
                if (Validator.isNumeric(sampleTypeNumber.ToString()) && Validator.isNumeric(labNumber.ToString()) && labNumber != 0)
                {
                    try
                    {
                        SampleModels sample = (from s in db.Samples
                                               where s.SampleTypeNumber == sampleTypeNumber && s.LabNumber <= labNumber
                                               orderby s.BatchNumber descending, s.LabNumber descending
                                               select s).FirstOrDefault();
                        if (sample != null)
                            return Json(GetEntry(sample.SampleTypeNumber, sample), JsonRequestBehavior.AllowGet);
                        sr.Message.Add("Sample Does Not Exist");
                        return null;
                    }
                    catch (Exception e)
                    {
                        Debug.Print(e.ToString());
                        return null;
                    }
                }
            }
            else
            {
                if (batchNumber.ToString().Length == 8 && Validator.isNumeric(batchNumber.ToString()) && Validator.isNumeric(labNumber.ToString()) && labNumber != 0)
                {
                    Debug.Print("bn != 0");
                    try
                    {
                        SampleModels sample = (from s in db.Samples
                                               where s.SampleTypeNumber == sampleTypeNumber && s.BatchNumber <= batchNumber && s.LabNumber <= labNumber
                                               orderby s.BatchNumber descending, s.LabNumber descending
                                               select s).FirstOrDefault();
                        Debug.Print(sample.LabNumber.ToString());
                        if (sample != null)
                            return Json(GetEntry(sample.SampleTypeNumber, sample), JsonRequestBehavior.AllowGet);
                        sr.Message.Add("Sample Does Not Exist");
                        return null;
                    }
                    catch (Exception e)
                    {
                        Debug.Print(e.ToString());
                        return null;
                    }
                }
            }
            return Json(GetEntry(sampleTypeNumber), JsonRequestBehavior.AllowGet);
        }
        #endregion
        #region "Add Sample"
        [HttpPost]
        public JsonResult AddSample(SampleViewModel sampleView, SampleChainModels sampleChain, List<SoilRecModels> sampleRecs, SubSampleInfoModels subSampleInfo)
        {
            Debug.Print("Starting Add...");
            
            if (!SampleExist(sampleView.SampleTypeNumber, sampleView.BatchNumber, sampleView.LabNumber) && (ValidateSample(sampleView) && ValidateSampleChain(sampleChain) && ValidateSampleRecs(sampleRecs)))
            {
                SampleModels newSample = new SampleModels();
                newSample.SampleTypeNumber = sampleView.SampleTypeNumber;
                newSample.AccountNumber = sampleView.AccountNumber;
                newSample.Grower = sampleView.Grower;
                newSample.BatchNumber = sampleView.BatchNumber;
                newSample.LabNumber = sampleView.LabNumber;
                newSample.ReportTypeNumber = sampleView.ReportTypeNumber;
                newSample.DateReceived = sampleView.DateReceived;
                newSample.CostTypeNumber = sampleView.CostTypeNumber;
                newSample.SampleID1 = sampleView.SampleID1;
                newSample.SampleID2 = sampleView.SampleID2;
                newSample.SampleID3 = sampleView.SampleID3;
                newSample.SampleID4 = sampleView.SampleID4;
                newSample.SampleID5 = sampleView.SampleID5;
              
                newSample.ReportCost = GetReportCost(newSample.SampleTypeNumber, newSample.ReportTypeNumber, newSample.CostTypeNumber);
                InvoiceModels invoice = GetInvoice(newSample.AccountNumber, newSample.BatchNumber, newSample.SampleTypeNumber);
                if (invoice == null)
                {
                    InvoiceModels newInvoice = CreateInvoice(newSample);
                    if (newInvoice != null)
                    {
                        db.Invoices.Add(newInvoice);
                        newSample.InvoiceNumber = newInvoice.InvoiceNumber;
                        newSample.DateReported = newInvoice.DateReported;
                    }
                    else
                    {
                        sr.ValidInvoice = false;
                        sr.Message.Add("Invoice was not created.");
                    }
                }
                else
                {
                    newSample.InvoiceNumber = invoice.InvoiceNumber;
                    newSample.DateReported = invoice.DateReported;
                }
                var recsExist = true;
                if (sampleRecs == null) // make ModelState valid
                {
                    recsExist = false;
                }
                
                var errors = ModelState.Values.SelectMany(v => v.Errors);
                if (ModelState.IsValid && sr.ValidInvoice)
                {
                    if (newSample.SampleTypeNumber == 1 || newSample.SampleTypeNumber == 14)
                    {
                        // Add soilsample data and sampleRecs
                        db.SampleChains.Add(sampleChain);
                        if (recsExist) //check if recs exist
                        {
                            foreach (SoilRecModels soilRec in sampleRecs)
                            {
                                if (soilRec.YieldGoal != 0.0) //check for blank recs
                                    db.SoilRecs.Add(soilRec);
                            }
                        }
                    }
                    else if (newSample.SampleTypeNumber == 2 || newSample.SampleTypeNumber == 3 || newSample.SampleTypeNumber == 4 || newSample.SampleTypeNumber == 5 && newSample.SampleTypeNumber == 6 || newSample.SampleTypeNumber == 7 || newSample.SampleTypeNumber == 9 || newSample.SampleTypeNumber == 12)
                    {
                        if (subSampleInfo != null)
                        {
                            db.SubSampleInfo.Add(subSampleInfo);
                        }
                    }
                    newSample = ConvertToUpperCase(newSample);
                    db.Samples.Add(newSample);
                    db.SaveChanges();

                    Debug.Print("Sample added");
                    return Json(GetEntry(newSample.SampleTypeNumber), JsonRequestBehavior.AllowGet);
                }
                else
                {
                    sr.Message.Add("Invalid invoice or modelstate");
                }
            }
            else
            {
                sr.Message.Add("Sample Already exists");
            }                        
            return null;
        }
        #endregion
        #region "Update Sample"             
        [HttpPost]
        public JsonResult UpdateSample(SampleViewModel sampleView, SampleChainModels sampleChain, List<SoilRecModels> sampleRecs, SubSampleInfoModels subSampleInfo)
        {
            OtherReturn entry = new OtherReturn();
            InvoiceModels invoice = new InvoiceModels();

            SampleModels sample = (from s in db.Samples
                                      where s.SampleTypeNumber == sampleView.SampleTypeNumber && s.BatchNumber == sampleView.BatchNumber && s.LabNumber == sampleView.LabNumber
                                      select s).SingleOrDefault();
            if (SampleExist(sampleView.SampleTypeNumber, sampleView.BatchNumber, sampleView.LabNumber))
            {
                ValidateSample(sampleView);
                ValidateSampleChain(sampleChain);
                ValidateSampleRecs(sampleRecs);
                if (ValidateSample(sampleView) && ValidateSampleChain(sampleChain) && ValidateSampleRecs(sampleRecs))
                {
                    sample.Grower = sampleView.Grower;
                    sample.DateReceived = sampleView.DateReceived;                    
                    sample.SampleID1 = sampleView.SampleID1;
                    sample.SampleID2 = sampleView.SampleID2;
                    sample.SampleID3 = sampleView.SampleID3;
                    sample.SampleID4 = sampleView.SampleID4;
                    sample.SampleID5 = sampleView.SampleID5;

                    // need to get new or existing invoice if batch or account numbers change
                    if (sampleView.BatchNumber != sample.BatchNumber || sampleView.AccountNumber != sample.AccountNumber)
                    {
                        sample.AccountNumber = sampleView.AccountNumber;
                        sample.BatchNumber = sampleView.BatchNumber;
                        invoice = CreateInvoice(sample);
                        db.Invoices.Add(invoice);
                        sample.InvoiceNumber = invoice.InvoiceNumber;
                        sample.DateReported = invoice.DateReported;
                    }
                    
                    // Get new report cost if RTN or cost type changes
                    if (sampleView.ReportTypeNumber != sample.ReportTypeNumber || sampleView.CostTypeNumber != sample.CostTypeNumber)
                    {
                        sample.ReportTypeNumber = sampleView.ReportTypeNumber;
                        sample.CostTypeNumber = sampleView.CostTypeNumber;
                        sample.ReportCost = GetReportCost(sample.SampleTypeNumber, sample.CostTypeNumber, sample.ReportTypeNumber);
                    }
                    
                    if (ModelState.IsValid)
                    {
                        sample = ConvertToUpperCase(sample);
                        db.Entry(sample).State = EntityState.Modified;

                        // Add soilsample data and sampleRecs
                        if (sample.SampleTypeNumber == 1 || sample.SampleTypeNumber == 14)
                        {
                            SampleChainModels sChain = db.SampleChains.Find(sample.BatchNumber, sample.LabNumber);
                            sChain.BatchNumber = sampleChain.BatchNumber;
                            sChain.LabNumber = sampleChain.LabNumber;
                            sChain.BeginningDepth = sampleChain.BeginningDepth;
                            sChain.EndingDepth = sampleChain.EndingDepth;
                            sChain.PastCropNumber = sampleChain.PastCropNumber;
                            sChain.LinkedSampleBatch = sampleChain.LinkedSampleBatch;
                            sChain.LinkedSampleLab = sampleChain.LinkedSampleLab;
                            sChain.TopSoil = sampleChain.TopSoil;
                            db.Entry(sChain).State = EntityState.Modified;

                            List<SoilRecModels> oldRecs = (from r in db.SoilRecs
                                                            where r.BatchNumber == sample.BatchNumber && r.LabNumber == sample.LabNumber
                                                            select r).ToList();
                            if (oldRecs.Count > 0)
                            {
                                foreach (SoilRecModels soilRec in oldRecs) // Delete old Recs
                                {
                                    db.SoilRecs.Remove(soilRec);
                                }
                            }
                            if (sampleRecs != null)
                            {
                                foreach (SoilRecModels soilRec in sampleRecs) // Add updated Recs
                                {
                                    if (soilRec.YieldGoal != 0.0) //check for blank recs
                                        db.SoilRecs.Add(soilRec);
                                }
                            }
                        }
                        else if (sample.SampleTypeNumber == 2 || sample.SampleTypeNumber == 3 || sample.SampleTypeNumber == 4 || sample.SampleTypeNumber == 5 && sample.SampleTypeNumber == 6 || sample.SampleTypeNumber == 7 || sample.SampleTypeNumber == 9 || sample.SampleTypeNumber == 12)
                        {
                            if (subSampleInfo != null)
                            {
                                Debug.Print("LabNumber: " + subSampleInfo.LabNumber);
                                Debug.Print("SubSampleTypeNumber: " + subSampleInfo.SubSampleTypeNumber);
                                SubSampleInfoModels oldSubSampleInfo = db.SubSampleInfo.Find(sample.SampleTypeNumber, sample.BatchNumber, sample.LabNumber);
                                oldSubSampleInfo.SampleTypeNumber = subSampleInfo.SampleTypeNumber;
                                oldSubSampleInfo.BatchNumber = subSampleInfo.BatchNumber;
                                oldSubSampleInfo.LabNumber = subSampleInfo.LabNumber;
                                oldSubSampleInfo.SubSampleTypeNumber = subSampleInfo.SubSampleTypeNumber;
                                oldSubSampleInfo.SubSubSampleTypeNumber = subSampleInfo.SubSubSampleTypeNumber;
                                db.Entry(oldSubSampleInfo).State = EntityState.Modified;
                            }
                        }

                        db.SaveChanges();
                        return Json(GetEntry(sample.SampleTypeNumber, sample), JsonRequestBehavior.AllowGet);
                    }
                    else
                    {
                        sr.Message.Add("Invalid ModelState");
                    }                    
                }
            }
            else
            {
                sr.Message.Add("Sample Already exists");
            }
            return Json(GetEntry(sampleView.SampleTypeNumber), JsonRequestBehavior.AllowGet);
        }
        #endregion
        #region "Delete Sample"
        [HttpPost]
        public JsonResult DeleteSample(int sampleTypeNumber, int batchNumber, int labNumber)
        {
            Debug.Print("Delete starting...");
            if (Validator.isNumeric(sampleTypeNumber.ToString()) && Validator.isNumeric(batchNumber.ToString()) && Validator.isNumeric(labNumber.ToString()))
            {
                SampleModels sample = db.Samples.Find(sampleTypeNumber, batchNumber, labNumber);
                
                if (sample != null)
                {
                    db.Samples.Remove(sample);
                    int invoiceCount = (from i in db.Samples
                                        where i.InvoiceNumber == sample.InvoiceNumber
                                        select i).Count();
                    if (invoiceCount == 1)
                    {
                        InvoiceModels invoice = GetInvoice(sample.InvoiceNumber);
                        db.Invoices.Remove(invoice);
                    }
                    if (sample.SampleTypeNumber == 1 || sample.SampleTypeNumber == 14)
                    {
                        SampleChainModels sampleChain = db.SampleChains.Find(batchNumber, labNumber);
                        db.SampleChains.Remove(sampleChain);
                        List<SoilRecModels> sampleRecs = (from sr in db.SoilRecs
                                                                where sr.BatchNumber == batchNumber && sr.LabNumber == labNumber
                                                                select sr).ToList();
                        foreach (SoilRecModels soilRec in sampleRecs)
                        {
                            db.SoilRecs.Remove(soilRec);
                        }
                    }
                    else if (sample.SampleTypeNumber == 2 || sample.SampleTypeNumber == 3 || sample.SampleTypeNumber == 4 || sample.SampleTypeNumber == 5 || sample.SampleTypeNumber == 6 || sample.SampleTypeNumber == 7 || sample.SampleTypeNumber == 9 || sample.SampleTypeNumber == 12)
                    {
                        SubSampleInfoModels subInfo = db.SubSampleInfo.Find(sample.SampleTypeNumber, sample.BatchNumber, sample.LabNumber);
                        if (subInfo != null)
                        {
                            db.SubSampleInfo.Remove(subInfo);
                        }                       
                    }
                    db.SaveChanges();
                    return Json(GetEntry(sample.SampleTypeNumber), JsonRequestBehavior.AllowGet);
                }
                else
                {
                    Debug.Print("Sample does NOT exist");
                }
            }
            else
            {
                Debug.Print("Input did not pass validation");
            }
            return null;
        }
        #endregion
        #region "Next"
        public JsonResult GetNext(int stn, int bn, int ln)
        {
            IEnumerable<SampleModels> x = (from s in db.Samples
                     where s.SampleTypeNumber == stn && s.BatchNumber >= bn && s.LabNumber > ln
                     orderby s.LabNumber, s.BatchNumber descending
                     select s).Take(30).ToList();

            if (x.Any())
            {
                x = (from s in x
                     orderby s.BatchNumber descending, s.LabNumber descending
                     select s).ToList();
                return Json(GetMoreSamples(x), JsonRequestBehavior.AllowGet);
            }
            else
            {
                return null;
            }            
        }
        #endregion
        #region "Prev"
        public JsonResult GetPrev(int stn, int bn, int ln)
        {
            Debug.Print("GetPrev called");
            IEnumerable<SampleModels> x = (from s in db.Samples
                     where s.SampleTypeNumber == stn && (s.BatchNumber <= bn && s.LabNumber < ln) || (s.BatchNumber < bn)
                     orderby s.BatchNumber descending, s.LabNumber descending
                     select s).Take(30).ToList();

            if (x.Any())
            {
                return Json(GetMoreSamples(x), JsonRequestBehavior.AllowGet);
            }
            else
            {
                return null;
            }

        }
        #endregion
        #region "GetMoreSamples"
        private Object GetMoreSamples(IEnumerable<SampleModels> samples)
        {
            int stn = samples.First().SampleTypeNumber;
            GenericInfo gInfo = new GenericInfo();
            gInfo.Samples = new List<SampleViewModel>();
            foreach (var y in samples)
            {
                gInfo.Samples.Add(CreateSampleView(y));
            }
            gInfo.Accounts = GetAccounts(gInfo.Samples);
            gInfo.Messages = GetMessages();

            if (stn == 1 || stn == 14)
            {
                SoilReturn soilReturn = new SoilReturn();
                soilReturn.GenericInfo = gInfo;
                soilReturn.SampleChains = GetSampleChainsList(soilReturn.GenericInfo.Samples);
                soilReturn.Recommendations = GetSampleRecommendations(soilReturn.GenericInfo.Samples);
                soilReturn.TopSoils = GetTopSoils(soilReturn.SampleChains, soilReturn.GenericInfo.Samples);
                return soilReturn;
            }
            else if (stn == 2 || stn == 3 || stn == 4 || stn == 6 || stn == 7 || stn == 9 || stn == 12)
            {
                SubSampleReturn sub = new SubSampleReturn();
                sub.GenericInfo = gInfo;

                sub.SubSampleInfos = new List<SubSampleInfoModels>();
                foreach (SampleViewModel s in sub.GenericInfo.Samples)
                {
                    var xy = GetSubSampleInfo(s.SampleTypeNumber, s.BatchNumber, s.LabNumber);
                    sub.SubSampleInfos.Add(xy);
                }
                return sub;
            }
            else if (stn == 5)
            {
                PlantReturn plant = new PlantReturn();
                plant.GenericInfo = gInfo;

                plant.SubSampleInfos = new List<SubSampleInfoModels>();
                foreach (SampleViewModel s in plant.GenericInfo.Samples)
                {
                    var xy = GetSubSampleInfo(s.SampleTypeNumber, s.BatchNumber, s.LabNumber);
                    plant.SubSampleInfos.Add(xy);
                }

                plant.SubSubSampleTypes = GetSubSubSampleTypes(stn);
                return plant;
            }
            else
            {
                return gInfo;
            }
        }
        #endregion
        #region "Validate Sample"
        public bool ValidateSample(SampleViewModel sample)
        {
            sr.ValidSample = true;

            // SampleTypeNumber
            if (!Validator.isNumeric(sample.SampleTypeNumber.ToString()))
            {
                sr.ValidSample = false;
                sr.Message.Add("Sample Type Number required");
            }

            // BatchNumber            
            if (!Validator.isNumeric(sample.BatchNumber.ToString()) || sample.BatchNumber.ToString().Length != 8)
            {
                sr.ValidSample = false;
                sr.Message.Add("Batch Number must be a length of 8");
            }

            // LabNumber
            if (!Validator.isNumeric(sample.LabNumber.ToString()))
            {
                sr.ValidSample = false;
                sr.Message.Add("Lab Number must be numeric");
            }            

            // ReportTypeNumber            
            if (Validator.isNumeric(sample.ReportTypeNumber.ToString()))
            {
                ReportTypeExist(sample.SampleTypeNumber, sample.ReportTypeNumber);
            }
            else
            {
                sr.ValidSample = false;
                sr.Message.Add("Report Type Number required");
            }

            // Grower
            if (!Validator.isPresent(sample.Grower))
            {
                sr.ValidSample = false;
                sr.Message.Add("Grower required");
            }

            // SampleID1
            if (!Validator.isPresent(sample.SampleID1))
            {
                sr.ValidSample = false;
                sr.Message.Add("Location required");
            }

            // SampleID2
            if (!Validator.isPresent(sample.SampleID2))
            {
                sr.ValidSample = false;
                sr.Message.Add("SampleID2 required");
            }

            // DateReceived
            if (!Validator.isPresent(sample.DateReceived.ToString()))
            {
                sr.ValidSample = false;
                sr.Message.Add("Date Received required");
            }

            // CostType
            if (!Validator.isNumeric(sample.CostTypeNumber.ToString()))
            {
                sr.ValidSample = false;
                sr.Message.Add("Cost Type required");
            }

            sr.Sample = sample;
            return sr.ValidSample;
        }
        #endregion
        #region "Validate SampleChain"
        public bool ValidateSampleChain(SampleChainModels sampleChain)
        {
            // PastCrop
            if (!Validator.isNumeric(sampleChain.PastCropNumber.ToString()))
            {
                sr.ValidSample = false;
                sr.Message.Add("Past Crop is required");
            }
            // BeginningDepth
            if (!Validator.isNumeric(sampleChain.BeginningDepth.ToString()))
            {
                sr.ValidSample = false;
                sr.Message.Add("Beginning Depth must be numeric");
            }

            // EndingDepth
            if (!Validator.isNumeric(sampleChain.EndingDepth.ToString()) && sampleChain.EndingDepth > sampleChain.BeginningDepth)
            {
                sr.ValidSample = false;
                sr.Message.Add("Ending Depth must be numeric and greater than Beginning Depth");
            }
            return sr.ValidSample;
        }
        #endregion
        #region "Validate SoilRecs"
        public bool ValidateSampleRecs(List<SoilRecModels> soilRecs)
        {
            if (soilRecs != null)
            {
                var count = 0;
                var recTypes = (from rt in db.SoilRecTypes
                                select rt).ToList();
                var cropTypes = (from ct in db.SoilRecCrops
                                 select ct).ToList();
                int recLength = soilRecs.Count();
                if (recLength > 0)
                {
                    foreach (SoilRecModels sRecs in soilRecs)
                    {
                        var rec = (from r in recTypes
                                   where r.RecTypeNumber == sRecs.RecTypeNumber
                                   select r.RecTypeNumber).SingleOrDefault();
                        var crop = (from c in cropTypes
                                    where c.CropTypeNumber == sRecs.CropTypeNumber
                                    select c.CropTypeNumber).SingleOrDefault();
                        // RecType
                        if (!Validator.isNumeric(sRecs.RecTypeNumber.ToString()))
                        {
                            sr.ValidSample = false;
                            sr.Message.Add("Rec Type " + count + " invalid");
                        }

                        // CropType
                        if (!Validator.isNumeric(sRecs.CropTypeNumber.ToString()))
                        {
                            sr.ValidSample = false;
                            sr.Message.Add("Crop Type " + count + " invalid");
                        }

                        // YieldGoal
                        if (!Validator.isNumeric(sRecs.YieldGoal.ToString()))
                        {
                            sr.ValidSample = false;
                            sr.Message.Add("Yield Goal " + count + " invalid");
                        }
                        count++;
                    }
                    if (recLength > 1)
                    {
                        var lastRecType = soilRecs[recLength - 1].RecTypeNumber;
                        var lastCropType = soilRecs[recLength - 1].CropTypeNumber;
                        var lastYieldGoal = soilRecs[recLength - 1].YieldGoal;

                        for (var i = 0; i <= recLength - 2; i++)
                        {
                            if (soilRecs[i].RecTypeNumber == lastRecType && soilRecs[i].CropTypeNumber == lastCropType && soilRecs[i].YieldGoal == lastYieldGoal)
                            {
                                sr.ValidSample = false;
                                sr.Message.Add("Can not have duplicate recommendations");
                            }
                        }
                    }
                }
            }
            return sr.ValidSample;
        }
        #endregion
    }
}