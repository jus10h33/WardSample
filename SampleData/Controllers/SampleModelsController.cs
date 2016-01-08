using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Text;
using System.Web.Mvc;
using SampleData.DAL;
using SampleData.Models;
using SampleData.Helpers;
using System.Web.Script.Serialization;
using System.Diagnostics;
using System.Text.RegularExpressions;

namespace SampleData.Controllers
{
    public class SampleModelsController : Controller
    {
        private WardDBContext db = new WardDBContext();
        private EntryReturn entry = new EntryReturn();
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

        public JsonResult Load(int sampleTypeNumber)
        {            
            return Json(GetEntry(sampleTypeNumber), JsonRequestBehavior.AllowGet);
        }
        public EntryReturn GetEntry(int stn, SampleModels sample = null)
        {
            try
            {
                entry.SampleTypes = GetSampleTypes();
                if (sample == null)
                {
                    sample = (from s in db.Samples
                                    where s.SampleTypeNumber == stn
                                    orderby s.BatchNumber descending, s.LabNumber descending
                                    select s).FirstOrDefault();                    
                }                

                SetSampleValues(sample);
                Debug.Print("SampleTypeNumber: " + entry.SampleTypeNumber);
                GetCustomer(entry.CustomerNumber);
                var report = GetReport(entry.SampleTypeNumber, entry.ReportTypeNumber);
                    entry.ReportTypeNumber = report.ReportTypeNumber;
                    entry.ReportName = report.ReportName;
                entry.Growers = GetGrowers(entry.CustomerNumber, entry.SampleTypeNumber);                
                var invoice = GetInvoice(entry.InvoiceNumber);
                    entry.InvoiceNumber = invoice.InvoiceNumber;
                    entry.DateReported = invoice.DateReported;
                entry.SampleColumns = GetSampleColumns(entry.SampleTypeNumber);
                GetSampleRecommendations();
            }
            catch (Exception e)
            {
                Debug.Print(e.ToString());
                return null;
            }
            return entry;
        }
        #region "Helper Functions"
        public void GetSampleRecommendations()
        {
            // Get First soil sample
            SoilSampleModels soilSample = (from ss in db.SoilSamples
                                where (ss.BatchNumber == entry.BatchNumber && ss.LabNumber == entry.LabNumber)
                                orderby ss.BeginningDepth ascending
                                select ss).FirstOrDefault();
            entry.BeginningDepth = soilSample.BeginningDepth;
            entry.EndingDepth = soilSample.EndingDepth;
            entry.PastCropNumber = soilSample.PastCropNumber;
            entry.LinkedSampleBatch = soilSample.LinkedSampleBatch;
            entry.LinkedSampleLab = soilSample.LinkedSampleLab;
            entry.TopSoil = soilSample.TopSoil;
            entry.PastCrops = GetPastCrops();
            entry.PastCropName = (from pc in entry.PastCrops
                                  where pc.PastCropNumber == entry.PastCropNumber
                                  select pc.PastCropName).SingleOrDefault();
            // Get all soil samples linked to entry.soilSample, if any
            if (soilSample.LinkedSampleLab == 0)
            {
                entry.SoilSamples = (from ss in db.SoilSamples
                                     where (ss.BatchNumber == entry.BatchNumber && ss.LabNumber == entry.LabNumber || (ss.LinkedSampleBatch == entry.BatchNumber && ss.LinkedSampleLab == entry.LabNumber))
                                     orderby ss.BeginningDepth ascending
                                     select ss).ToList();
            }
            else
            {
                entry.SoilSamples = (from ss in db.SoilSamples
                                     where (ss.BatchNumber == entry.LinkedSampleBatch && ss.LabNumber == entry.LinkedSampleLab) || (ss.LinkedSampleBatch == entry.LinkedSampleBatch && ss.LinkedSampleLab == entry.LinkedSampleLab)
                                     orderby ss.BeginningDepth ascending
                                     select ss).ToList();
            }
           
            entry.SoilRecCrops = (from x in db.SoilRecCrops
                                  orderby x.CropTypeNumber
                                  select x).ToList();            

            var recCrops = (from x in db.SoilRecCrops
                            orderby x.CropTypeNumber
                            select x).ToList();
            entry.CropTypes = new List<string>();
            foreach (SoilRecCropModels rc in recCrops)
            {
                entry.CropTypes.Add(rc.CropTypeNumber.ToString() + " - " + rc.CropTypeName);
            }

            if (entry.SampleTypeNumber == 1)
            {
                entry.SoilRecTypes = (from y in db.SoilRecTypes
                                      where y.RecTypeName != "HANEY"
                                      orderby y.RecTypeNumber
                                      select y).ToList();
               
                entry.RecTypes = new List<string>();
                foreach (SoilRecTypeModels rt in entry.SoilRecTypes)
                {
                    entry.RecTypes.Add(rt.RecTypeNumber.ToString() + " - " + rt.RecTypeName);
                }
            }

            entry.Recommendations = new List<Recommendations>();
            if (entry.SampleTypeNumber == 1 || entry.SampleTypeNumber == 14)
            {
                List<SoilSampleRecModels> soilSampleRecs = GetSoilSampleRecs(entry.BatchNumber, entry.LabNumber);
                foreach (SoilSampleRecModels r in soilSampleRecs)
                {
                    Recommendations rec = new Recommendations();
                    rec.BatchNumber = r.BatchNumber;
                    rec.LabNumber = r.LabNumber;
                    rec.Priority = r.Priority;
                    rec.RecTypeNumber = r.RecTypeNumber;
                    rec.CropTypeNumber = r.CropTypeNumber;
                    rec.YieldGoal = r.YieldGoal;
                    if (entry.SampleTypeNumber == 14)
                    {
                        rec.RecTypeName = "4 - Haney";
                        rec.RecTypeNumber = 4;
                    }
                    else
                    {
                        rec.RecTypeName = rec.RecTypeNumber + " - " + (from x in entry.SoilRecTypes
                                                                       where x.RecTypeNumber == rec.RecTypeNumber
                                                                       select x.RecTypeName).SingleOrDefault();
                    }
                    
                    var src = (from y in entry.SoilRecCrops
                            where y.CropTypeNumber == rec.CropTypeNumber
                            select y).SingleOrDefault();

                    rec.CropTypeName = rec.CropTypeNumber + " - " + src.CropTypeName + ":" + src.Unit;
                    entry.Recommendations.Add(rec);
                }
            }            
        }
        public JsonResult FindCustomer(int customerNumber)
        {
            CustomerModels customer = new CustomerModels();
            customer = CustomerExist(customerNumber);
            if (customer == null) {
                return Json("Customer Not Found", JsonRequestBehavior.AllowGet);
            }
            else
            {                                
                return Json(customer, JsonRequestBehavior.AllowGet);
            }
        }        
        public void SetSampleValues(SampleModels sample)
        {
            Debug.Print("SampleTypeNumber: " + sample.SampleTypeNumber + ", or " + entry.SampleTypeNumber);
            entry.BatchNumber = sample.BatchNumber;
            entry.CustomerNumber = sample.CustomerNumber;
            entry.DateReceived = sample.DateReceived;
            entry.Grower = sample.Grower;
            entry.InvoiceNumber = sample.InvoiceNumber;
            entry.LabNumber = sample.LabNumber;
            entry.ReportCost = sample.ReportCost;
            entry.ReportTypeNumber = sample.ReportTypeNumber;
            entry.SampleID1 = sample.SampleID1;
            entry.SampleID2 = sample.SampleID2;
            entry.SampleID3 = sample.SampleID3;
            entry.SampleID4 = sample.SampleID4;
            entry.SampleID5 = sample.SampleID5;
            entry.SampleTypeNumber = sample.SampleTypeNumber;
            entry.StandardCost = sample.StandardCost;            
        }

        [HttpPost]
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
                                 select r).FirstOrDefault();
                        return report.ReportName;
                }
                catch (Exception e)
                {
                    Debug.Print(e.ToString());
                }
            }
            else
            {
                Debug.Print("ReportTypeNumber is not numeric.");
            }
                return null;
        }
        public JsonResult GetGrower(int customerNumber, int sampleTypeNumber)
        {
            if (Validator.isNumeric(customerNumber.ToString()) && Validator.isNumeric(sampleTypeNumber.ToString()))
            {
                return Json(GetGrowers(customerNumber, sampleTypeNumber), JsonRequestBehavior.AllowGet);           
            }
            else
                return null;
        }
        public List<SampleTypeModels> GetSampleTypes()
        {
            return  db.SampleTypes.ToList();
        }
        public SampleModels GetSample(int stn, int bn, int ln)
        {
            return (from s in db.Samples
                    where s.SampleTypeNumber == stn && s.BatchNumber == bn && s.LabNumber == ln
                    select s).FirstOrDefault();
        }
        public bool SampleExist(int stn, int bn, int ln)
        {
            SampleModels s = db.Samples.Find(stn, bn, ln);
            if (s != null)
            {
                return false;
            }
            return true;
        }
        public List<SoilSampleRecModels> GetSoilSampleRecs(int bn, int ln)
        {
            return (from ssr in db.SoilSampleRecs
             where ssr.BatchNumber == bn && ssr.LabNumber == ln
             orderby ssr.Priority
             select ssr).ToList();
        }
        public SampleModels ConvertToUpperCase(SampleModels sample)
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
            return sample;
        }
        public List<SampleColumns> GetSampleColumns(int stn)
        {
            return (from sc in db.SampleColumns
                    where sc.SampleTypeNumber == stn
                    orderby sc.ColumnOrder
                    select sc).ToList();
        }
        public ReportModels GetReport(int stn, int rtn)
        {
            ReportModels report = new ReportModels();
            report = (from r in db.Reports
                    where r.SampleTypeNumber == stn & r.ReportTypeNumber == rtn
                    select r).FirstOrDefault();
            return report;
        }
        public double GetReportCost(SampleModels sample)
        {
            ReportModels report = GetReport(sample.SampleTypeNumber, sample.ReportTypeNumber);
            if (sample.StandardCost == 1) {
                return report.StandardCost;
            } else if (sample.StandardCost == 2) {
                return report.PrimaryVolumeCost;
            } else {
                return 0;
            }
        }
        public bool ReportTypeExist(int stn, int rtn)
        {
            try
            {
                ReportModels report = GetReport(stn, rtn);
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }
        public List<string> GetGrowers(int cn, int stn)
        {
            return (from g in db.Samples
                    where g.CustomerNumber == cn && g.SampleTypeNumber == stn
                    select g.Grower).Distinct().ToList();
        }
        public InvoiceModels GetInvoice(int inv)
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
                Debug.Print(e.ToString());
                return null;
            }
        }
        public InvoiceModels GetInvoice(int cn, int bn, int stn)
        {
            try
            {
                InvoiceModels invoice = (from inv in db.Invoices
                           where inv.BatchNumber == bn && inv.CustomerNumber == cn && inv.SampleTypeNumber == stn
                           select inv).FirstOrDefault();
                entry.DateReported = invoice.DateReported;
                entry.InvoiceNumber = invoice.InvoiceNumber;
                return invoice;
            }
            catch (Exception e)
            {
                Debug.Print(e.ToString());
                return null;
            }            
        }
        public InvoiceModels CreateInvoice(SampleModels sample)
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
                newInvoice.CustomerNumber = sample.CustomerNumber;
                newInvoice.DateReported = new DateTime(Convert.ToInt32(sample.BatchNumber.ToString().Substring(0, 4)), Convert.ToInt32(sample.BatchNumber.ToString().Substring(4, 2)), Convert.ToInt32(sample.BatchNumber.ToString().Substring(6, 2)));
                CustomerModels customer = db.Customers.Find(sample.CustomerNumber);
                newInvoice.CustomerDiscount = customer.Discount;
                newInvoice.Comments = "0";
                newInvoice.Locked = 0;
                newInvoice.PostageCost = 0.0;

                entry.DateReported = newInvoice.DateReported;
                entry.InvoiceNumber = newInvoice.InvoiceNumber;

                return newInvoice;
                
            }
            catch (Exception ex)
            {
                Debug.Print("Error occurred getting max invoice.  " + ex.ToString());
                return null;
            }
        }
        public int GetLabNumber(int stn, int bn)
        {
            try
            {
                string bnYear = bn.ToString().Substring(0, 4);
                string bnMMDD = Regex.Replace(bn.ToString().Substring(4, 4), "[1-9]", "0");
                int bnTmp = Convert.ToInt32(String.Concat(bnYear, bnMMDD));
                Debug.Print("Concatenated Batch Number:  " + bnTmp);
                int labNumber = (from s in db.Samples
                                 where s.SampleTypeNumber == stn && s.BatchNumber > bnTmp
                                 orderby s.LabNumber descending
                                 select s.LabNumber).FirstOrDefault();
                return labNumber + 1;
            }
            catch (Exception e)
            {
                Debug.Print("GetLabNumber error:  " + e.Message);
                return 0;
            }
        }
        public bool LabNumberExists(int stn, int bn, int ln, int cn)
        {
            try
            {
                string bnYear = bn.ToString().Substring(0, 4);
                string bnMMDD = Regex.Replace(bn.ToString().Substring(4, 4), "[1-9]", "0");
                int bnTmp = Convert.ToInt32(String.Concat(bnYear, bnMMDD));
                SampleModels sample = (from s in db.Samples
                                 where (s.SampleTypeNumber == stn && s.BatchNumber > bnTmp && s.LabNumber == ln) || s.SampleTypeNumber == stn && s.BatchNumber > bnTmp && s.LabNumber == ln && s.CustomerNumber == cn
                                       select s).FirstOrDefault();
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }
        public CustomerModels GetCustomer(int cn)
        {
            CustomerModels c = db.Customers.Find(cn);
            entry.Address1 = c.Address1;
            entry.Company = c.Company;
            entry.Name = c.FirstName + " " + c.LastName;
            entry.CityStZip = c.City + ", " + c.State + " " + c.Zip.ToString();
            entry.SampleEntryInformation = c.SampleEntryInformation;
            return c;
        }        
        public CustomerModels CustomerExist(int cn)
        {
            CustomerModels customer = GetCustomer(cn);
            if (customer != null)
                return customer;
            else
                return null;
        }
        public List<PastCropModels> GetPastCrops()
        {
           return db.PastCrops.ToList();
        }

        #endregion
        #region "Find Sample"
        [HttpPost]
        public JsonResult FindSample(int sampleTypeNumber, int batchNumber, int labNumber)
        {
            if (batchNumber.ToString().Length == 8 && Validator.isNumeric(batchNumber.ToString()) && Validator.isNumeric(labNumber.ToString()) && labNumber != 0)
            {
                EntryReturn entry = new EntryReturn();
                try
                {
                    SampleModels sample = db.Samples.Find(sampleTypeNumber, batchNumber, labNumber);
                    if (sample != null)
                    {
                        entry = GetEntry(sample.SampleTypeNumber, sample);                        
                    }
                    return Json(entry, JsonRequestBehavior.AllowGet);
                }
                catch (Exception e)
                {
                    Debug.Print(e.ToString());
                    return null;
                }
            }
            else
            {
                return null;
            }
        }
        #endregion
        #region "Add Sample"
        [HttpPost]
        public JsonResult AddSample(SampleModels sample, InvoiceModels invoice, SoilSampleModels soilSample, List<SoilSampleRecModels> sampleRecs = null)
        {
            EntryReturn entry = new EntryReturn();
            SampleResult sr = new SampleResult();
            sr = ValidateSample(sample);
            if (sr.ValidSample)
            {
                sample.LabNumber = GetLabNumber(sample.SampleTypeNumber, sample.BatchNumber);
                soilSample.LabNumber = sample.LabNumber;
                sample.ReportCost = GetReportCost(sample);
                invoice = GetInvoice(sample.CustomerNumber, sample.BatchNumber, sample.SampleTypeNumber);
                if (invoice == null)
                {
                    InvoiceModels newInvoice = CreateInvoice(sample);
                    if (newInvoice != null)
                    {
                        db.Invoices.Add(newInvoice);
                        //sample.InvoiceNumber = newInvoice.InvoiceNumber;
                    }
                    else
                    {
                        sr.ValidInvoice = false;
                        sr.Message = "Invoice was not created.";
                        Debug.Print(sr.Message);
                    }
                }
                else
                {
                    Debug.Print("Invoice already exists. Setting invoice....");
                    sample.InvoiceNumber = invoice.InvoiceNumber;
                    entry.InvoiceNumber = invoice.InvoiceNumber;
                }

                if (ModelState.IsValid && sr.ValidInvoice)
                {
                    // Add soilsample data and sampleRecs
                    db.SoilSamples.Add(soilSample);
                    if (sampleRecs[0].YieldGoal != 0.0 && sampleRecs != null) //check for blank recs
                    {                        
                        foreach (SoilSampleRecModels soilRec in sampleRecs)
                        {
                            if (soilRec.YieldGoal != 0.0) //check for blank recs
                                db.SoilSampleRecs.Add(soilRec);
                        }
                        
                    }


                    sample = ConvertToUpperCase(sample);
                    db.Samples.Add(sample);
                    db.SaveChanges();
                    return Json(entry, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    if (!sr.ValidInvoice)
                    {
                        Debug.Print("*******************Hit !sr.ValidInvoice*****************");
                    }
                    else
                    {
                        sr.Message += "   :Invalid ModelState";
                    }
                }
            }
            Debug.Print("Error adding Sample   ========>   " + sr.Message);
            return null;
        }

        private List<SoilSampleRecModels> GetRecs(List<Recommendations> sampleRecs)
        {
            throw new NotImplementedException();
        }
        #endregion
        #region "Update Sample"
        [HttpPost]
        public JsonResult UpdateSample(SampleModels sample, InvoiceModels invoice, SoilSampleModels soilSample, List<SoilSampleRecModels> sampleRecs)
        {
            Debug.Print("Starting sample update.....");
            //foreach (SoilSampleRecModels r in sampleRecs)
            //{
            //    Debug.Print();
            //}
            
            SampleResult sr = new SampleResult();
            EntryReturn entry = new EntryReturn();
            entry.SampleTypes = db.SampleTypes.ToList();
            sample.InvoiceNumber = invoice.InvoiceNumber;            
            SampleModels oldSample = (from s in db.Samples
                                      where s.SampleTypeNumber == sample.SampleTypeNumber && s.BatchNumber == sample.BatchNumber && s.LabNumber == sample.LabNumber
                                      select s).SingleOrDefault();
            sr = ValidateSample(sample);
            if (sr.ValidSample)
            {  // need to get new or existing invoice is batch or customer numbers change
                if (oldSample.BatchNumber != sample.BatchNumber)
                {
                    invoice = GetInvoice(sample.CustomerNumber, sample.BatchNumber, sample.SampleTypeNumber);
                    if (invoice == null)
                    {
                        invoice = CreateInvoice(sample);
                    }
                }
                else if (oldSample.CustomerNumber != sample.CustomerNumber)
                {
                    invoice = CreateInvoice(sample);
                    sample.InvoiceNumber = invoice.InvoiceNumber;
                }
                // Get new report cost if RTN or cost type changes
                if (oldSample.ReportTypeNumber != sample.ReportTypeNumber || oldSample.StandardCost != sample.StandardCost)
                {
                    sample.ReportCost = GetReportCost(sample);
                }

                if (LabNumberExists(sample.SampleTypeNumber, sample.BatchNumber, sample.LabNumber, sample.CustomerNumber) && oldSample.LabNumber != sample.LabNumber)
                {
                    sr.ValidSample = false;
                    sr.Message = "LabNumber already exists";
                }
                else
                {
                    oldSample = sample;
                    //oldSample.SampleTypeNumber = sample.SampleTypeNumber;
                    //oldSample.BatchNumber = sample.BatchNumber;
                    //oldSample.CustomerNumber = sample.CustomerNumber;
                    //oldSample.LabNumber = sample.LabNumber;
                    //oldSample.Grower = sample.Grower;
                    //oldSample.SampleID1 = sample.SampleID1;
                    //oldSample.SampleID2 = sample.SampleID2;
                    //oldSample.SampleID3 = sample.SampleID3;
                    //oldSample.SampleID4 = sample.SampleID4;
                    //oldSample.ReportTypeNumber = sample.ReportTypeNumber;
                    //oldSample.DateReceived = sample.DateReceived;
                    //oldSample.StandardCost = sample.StandardCost;
                    if (ModelState.IsValid)
                    {
                        oldSample = ConvertToUpperCase(oldSample);
                        db.Entry(oldSample).State = EntityState.Modified;
                        // Add soilsample data and sampleRecs
                        SoilSampleModels ssample = db.SoilSamples.Find(sample.BatchNumber, sample.LabNumber); // Do I need to find it first
                        db.SoilSamples.Remove(ssample);
                        db.SoilSamples.Add(soilSample);
                        
                        List<SoilSampleRecModels> oldRecs = (from r in db.SoilSampleRecs
                                                          where r.BatchNumber == sample.BatchNumber && r.LabNumber == sample.LabNumber
                                                          select r).ToList();
                        foreach (SoilSampleRecModels soilRec in oldRecs) // Delete old Recs
                        {
                                db.SoilSampleRecs.Remove(soilRec);
                        }
                        foreach (SoilSampleRecModels soilRec in sampleRecs) // Add updated Recs
                        {
                            if (soilRec.YieldGoal != 0.0) //check for blank recs
                                db.SoilSampleRecs.Add(soilRec);
                        }
                        db.SaveChanges();

                        Debug.Print("SAMPLE UPDATE COMPLETED-----------");
                        entry = GetEntry(oldSample.SampleTypeNumber, oldSample);
                        // Replace with invoice found or created from above
                        entry.InvoiceNumber = invoice.InvoiceNumber;
                        entry.DateReported = invoice.DateReported;

                        return Json(entry, JsonRequestBehavior.AllowGet);
                    }
                    else
                    {
                        Debug.Print("Invalid modelstate");
                    }
                }
            }
            Debug.Print(sr.Message);
            return Json(entry, JsonRequestBehavior.AllowGet); ;
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
                SoilSampleModels soilSample = db.SoilSamples.Find(batchNumber, labNumber); // Do I need to find it first
                db.SoilSamples.Remove(soilSample);
                List<SoilSampleRecModels> sampleRecs = (from sr in db.SoilSampleRecs
                                                        where sr.BatchNumber == batchNumber && sr.LabNumber == labNumber
                                                        select sr).ToList();
                foreach (SoilSampleRecModels soilRec in sampleRecs)
                {
                    db.SoilSampleRecs.Remove(soilRec);
                }

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
        #region "Validate Sample"
        public SampleResult ValidateSample(SampleModels sample)
        {
            SampleResult sr = new SampleResult();
            sr.ValidSample = true;
            StringBuilder sbMessage = new StringBuilder();

            //SampleTypeNumber
            if (!Validator.isNumeric(sample.SampleTypeNumber.ToString()))
            {
                sr.ValidSample = false;
                sbMessage.AppendLine("Sample Type Number required");
            }

            //BatchNumber            
            if (!Validator.isNumeric(sample.BatchNumber.ToString()) || sample.BatchNumber.ToString().Length != 8)
            {
                sr.ValidSample = false;
                sbMessage.AppendLine("Batch Number != Length.8");
            }

            //LabNumber
            if (!Validator.isNumeric(sample.LabNumber.ToString()))
            {
                sr.ValidSample = false;
                sbMessage.AppendLine("Lab Number must be numeric");
            }

            //Check if Sample exists
            if (sr.ValidSample)
            {
                SampleExist(sample.SampleTypeNumber, sample.BatchNumber, sample.LabNumber);
            }

            //ReportTypeNumber            
            if (Validator.isNumeric(sample.ReportTypeNumber.ToString()))
            {
                ReportTypeExist(sample.SampleTypeNumber, sample.ReportTypeNumber);
            }
            else
            {
                sr.ValidSample = false;
                sbMessage.AppendLine("Report Type Number required");
            }

            //Grower
            if (!Validator.isPresent(sample.Grower))
            {
                sr.ValidSample = false;
                sbMessage.AppendLine("Grower required");
            }

            //SampleID1
            if (!Validator.isPresent(sample.SampleID1))
            {
                sr.ValidSample = false;
                sbMessage.AppendLine("Location required");
            }

            //SampleID2
            if (!Validator.isPresent(sample.SampleID2))
            {
                sr.ValidSample = false;
                sbMessage.AppendLine("SampleID2 required");
            }

            //DateReceived
            if (!Validator.isPresent(sample.DateReceived.ToString()))
            {
                sr.ValidSample = false;
                sbMessage.AppendLine("Date Received required");
            }

            //CostType
            if (!Validator.isNumeric(sample.StandardCost.ToString()))
            {
                sr.ValidSample = false;
                sbMessage.AppendLine("Cost Type required");
            }
            sr.Message = sbMessage.ToString();
            sr.Sample = sample;
            return sr;
        }
        #endregion
    }
}