﻿using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Text;
using System.Web.Mvc;
using SampleData.DAL;
using SampleData.Models;
using SampleData.ViewModels;
using SampleData.Helpers;
using System.Web.Script.Serialization;
using System.Diagnostics;
using System.Text.RegularExpressions;

namespace SampleData.Controllers
{
    public class SampleModelsController : Controller
    {
        private WardDBContext db = new WardDBContext();
        
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
        public JsonResult Load(int sampleTypeNumber)
        {
            return Json(GetEntry(sampleTypeNumber), JsonRequestBehavior.AllowGet);
        }
        private EntryReturn GetEntry(int stn, SampleModels sample = null)
        {
            EntryReturn entry = new EntryReturn();
            try
            {
                entry.SampleTypes = GetSampleTypes();
                Debug.Print("SampleType1: " + entry.SampleTypes[0].SampleTypeName);
                if (sample == null)
                {
                    sample = GetSample(stn);
                }
                entry.Sample = SetSampleValues(sample);
                entry.Customer = new CustomerViewModel();
                CustomerModels customer = GetCustomer(entry.Sample.CustomerNumber);
                
                entry.Customer.Address1 = customer.Address1;
                Debug.Print("FirstName2: " + entry.Customer.Address1);
                entry.Customer.Company = customer.Company;
                entry.Customer.Name = customer.FirstName + " " + customer.LastName;
                entry.Customer.CityStZip = customer.City + ", " + customer.State + " " + customer.Zip.ToString();
                entry.Customer.SampleEntryInformation = customer.SampleEntryInformation;
                entry.Growers = GetGrowers(entry.Sample.CustomerNumber, entry.Sample.SampleTypeNumber);
                //InvoiceModels invoice = GetInvoice(entry.Sample.CustomerNumber, entry.Sample.BatchNumber, entry.Sample.SampleTypeNumber);
                //Debug.Print("invoicenumber: " + invoice.InvoiceNumber);
                //entry.Sample.InvoiceNumber = invoice.InvoiceNumber;
                //entry.Sample.DateReported = invoice.DateReported;
                //ReportModels report = GetReport(entry.Sample.SampleTypeNumber, entry.Sample.ReportTypeNumber);
                //entry.Sample.ReportTypeNumber = report.ReportTypeNumber;
                //entry.Sample.ReportCost = GetReportCost(entry.Sample.SampleTypeNumber, entry.Sample.CostTypeNumber, entry.Sample.ReportTypeNumber);
                //entry.Sample.ReportName = GetReportName(entry.Sample.SampleTypeNumber, entry.Sample.ReportTypeNumber);

                // Build Sample Chain -Get first soil sample
                entry.SoilSample = GetSoilSample(sample.BatchNumber, sample.LabNumber);
                // Check in sample is linked - if so, get linked samples
                if ( entry.SoilSample != null)
                {
                    if (entry.SoilSample.LinkedSampleLab == 0)
                    {
                        entry.SoilSamples = (from ss in db.SoilSamples
                                             where (ss.BatchNumber == entry.Sample.BatchNumber && ss.LabNumber == entry.Sample.LabNumber || (ss.LinkedSampleBatch == entry.Sample.BatchNumber && ss.LinkedSampleLab == entry.Sample.LabNumber))
                                             orderby ss.BeginningDepth ascending
                                             select ss).ToList();
                    }
                    else
                    {
                        entry.SoilSamples = (from ss in db.SoilSamples
                                             where (ss.BatchNumber == entry.SoilSample.LinkedSampleBatch && ss.LabNumber == entry.SoilSample.LinkedSampleLab) || (ss.LinkedSampleBatch == entry.SoilSample.LinkedSampleBatch && ss.LinkedSampleLab == entry.SoilSample.LinkedSampleLab)
                                             orderby ss.BeginningDepth ascending
                                             select ss).ToList();
                    }
                    entry.PastCrops = GetPastCrops();
                    entry.Sample.PastCropName = (from pc in entry.PastCrops
                                                 where pc.PastCropNumber == entry.SoilSample.PastCropNumber
                                                 select pc.PastCropName).SingleOrDefault();
                    List<SoilRecTypeModels> soilRecTypes = new List<SoilRecTypeModels>();
                    if (entry.Sample.SampleTypeNumber == 1)
                    {
                        soilRecTypes = GetSoilRecTypes();
                        entry.RecTypes = new List<string>();
                        foreach (SoilRecTypeModels rt in soilRecTypes)
                        {
                            entry.RecTypes.Add(rt.RecTypeNumber.ToString() + " - " + rt.RecTypeName);
                        }
                    }

                    List<SoilRecCropModels> soilRecCrops = GetSoilRecCrops();
                    entry.CropTypes = new List<string>();
                    foreach (SoilRecCropModels rc in soilRecCrops)
                    {
                        entry.CropTypes.Add(rc.CropTypeNumber.ToString() + " - " + rc.CropTypeName + ":" + rc.Unit);
                    }


                    if (entry.Sample.SampleTypeNumber == 1 || entry.Sample.SampleTypeNumber == 14)
                    {
                        entry.Recommendations = GetSampleRecommendations(entry.Sample.SampleTypeNumber, entry.Sample.BatchNumber, entry.Sample.LabNumber, soilRecTypes, soilRecCrops);
                    }
                }              

                entry.SampleColumns = GetSampleColumns(entry.Sample.SampleTypeNumber);
                return entry;
            }
            catch (Exception e)
            {
                Debug.Print(e.ToString());
                return null;
            }
        }
        private SampleModels GetSample(int stn, int bn = 0, int ln = 0)
        {
            if (bn == 0 || ln == 0)
            {
                return (from s in db.Samples
                        where s.SampleTypeNumber == stn
                        orderby s.BatchNumber descending, s.LabNumber descending
                        select s).FirstOrDefault();
            }
            else
            {
                return (from s in db.Samples
                        where s.SampleTypeNumber == stn && s.BatchNumber == bn && s.LabNumber == ln
                        select s).SingleOrDefault();
            }
        }
        private SampleViewModel SetSampleValues(SampleModels sample)
        {
            SampleViewModel sampleView = new SampleViewModel();
            
            sampleView.SampleTypeNumber = sample.SampleTypeNumber;
            sampleView.CustomerNumber = sample.CustomerNumber;
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
            Debug.Print("customer number: " + sampleView.CustomerNumber);
            return sampleView;
        }
        private SoilSampleModels GetSoilSample(int bn, int ln)
        {
            return (from ss in db.SoilSamples
                    where (ss.BatchNumber == bn && ss.LabNumber == ln)
                    orderby ss.BeginningDepth ascending
                    select ss).FirstOrDefault();
        }
        private List<SoilRecTypeModels> GetSoilRecTypes()
        {
            return (from y in db.SoilRecTypes
                    where y.RecTypeName != "HANEY"
                    orderby y.RecTypeNumber
                    select y).ToList();
        }
        private List<SoilRecCropModels> GetSoilRecCrops()
        {
            return (from x in db.SoilRecCrops
                    orderby x.CropTypeNumber
                    select x).ToList();
        }
        private List<Recommendations> GetSampleRecommendations(int stn, int bn, int ln, List<SoilRecTypeModels> soilRecTypes, List<SoilRecCropModels> soilRecCrops)
        {

            List <Recommendations> recommendations = new List<Recommendations>();
            if (stn == 1 || stn == 14)
            {
                List<SoilSampleRecModels> soilSampleRecs = GetSoilSampleRecs(bn, ln);
                foreach (SoilSampleRecModels r in soilSampleRecs)
                {
                    Recommendations rec = new Recommendations();
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
                        rec.RecTypeName = rec.RecTypeNumber + " - " + (from x in soilRecTypes
                                                                       where x.RecTypeNumber == rec.RecTypeNumber
                                                                       select x.RecTypeName).SingleOrDefault();
                    }
                    
                    var src = (from y in soilRecCrops
                            where y.CropTypeNumber == rec.CropTypeNumber
                            select y).SingleOrDefault();

                    rec.CropTypeName = rec.CropTypeNumber + " - " + src.CropTypeName + ":" + src.Unit;
                    recommendations.Add(rec);
                }                
            }
            return recommendations;
        }
        [HttpPost]
        public JsonResult FindCustomer(int customerNumber)
        {
            CustomerModels customer = new CustomerModels();
            
            if (CustomerExist(customerNumber)) {
                customer = GetCustomer(customerNumber);

                CustomerViewModel customerView = new CustomerViewModel();

                customerView.Name = customer.FirstName + " " + customer.LastName;
                customerView.Company = customer.Company;
                customerView.Address1 = customer.Address1;
                customerView.CityStZip = customer.City + ", " + customer.State + " " + customer.Zip;
                customerView.SampleEntryInformation = customer.SampleEntryInformation;
                return Json(customerView, JsonRequestBehavior.AllowGet);                
            }
            else
            {
                return Json("Customer Not Found", JsonRequestBehavior.AllowGet);
            }
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
        private bool SampleExist(int stn, int bn, int ln)
        {
            SampleModels s = db.Samples.Find(stn, bn, ln);
            if (s != null)
            {
                return false;
            }
            return true;
        }
        private List<SoilSampleRecModels> GetSoilSampleRecs(int bn, int ln)
        {
            return (from ssr in db.SoilSampleRecs
             where ssr.BatchNumber == bn && ssr.LabNumber == ln
             orderby ssr.Priority
             select ssr).ToList();
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
            return sample;
        }
        private List<SampleColumns> GetSampleColumns(int stn)
        {
            return (from sc in db.SampleColumns
                    where sc.SampleTypeNumber == stn
                    orderby sc.ColumnOrder
                    select sc).ToList();
        }
        private ReportModels GetReport(int stn, int rtn)
        {
            ReportModels report = new ReportModels();
            report = (from r in db.Reports
                    where r.SampleTypeNumber == stn & r.ReportTypeNumber == rtn
                    select r).FirstOrDefault();
            return report;
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
                Debug.Print(e.ToString());
                return null;
            }
        }
        private InvoiceModels GetInvoice(int cn, int bn, int stn)
        {
            try
            {
                InvoiceModels invoice = (from inv in db.Invoices
                           where inv.BatchNumber == bn && inv.CustomerNumber == cn && inv.SampleTypeNumber == stn
                           select inv).FirstOrDefault();
                return invoice;
            }
            catch (Exception e)
            {
                Debug.Print(e.ToString());
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
                newInvoice.CustomerNumber = sample.CustomerNumber;
                newInvoice.DateReported = new DateTime(Convert.ToInt32(sample.BatchNumber.ToString().Substring(0, 4)), Convert.ToInt32(sample.BatchNumber.ToString().Substring(4, 2)), Convert.ToInt32(sample.BatchNumber.ToString().Substring(6, 2)));
                CustomerModels customer = db.Customers.Find(sample.CustomerNumber);
                newInvoice.CustomerDiscount = customer.Discount;
                newInvoice.Comments = "0";
                newInvoice.Locked = 0;
                newInvoice.PostageCost = 0.0;
                return newInvoice;                
            }
            catch (Exception ex)
            {
                Debug.Print("Error occurred getting max invoice.  " + ex.ToString());
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
        private bool LabNumberExists(int stn, int bn, int ln, int cn)
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
        private CustomerModels GetCustomer(int cn)
        {
            CustomerModels c = (from cust in db.Customers
                                where cust.CustomerNumber == cn
                                select cust).SingleOrDefault();
            Debug.Print("FirstName: " + c.FirstName);        
            return c;
        }
        private bool CustomerExist(int cn)
        {
            CustomerModels customer = GetCustomer(cn);
            if (customer != null)
                return true;
            else
                return false;
        }
        private List<PastCropModels> GetPastCrops()
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
        public JsonResult AddSample(SampleModels sample, SoilSampleModels soilSample, List<SoilSampleRecModels> sampleRecs = null)
        {
            EntryReturn entry = new EntryReturn();
            SampleResult sr = new SampleResult();
            sr = ValidateSample(sample);
            if (sr.ValidSample)
            {
                sample.LabNumber = GetLabNumber(sample.SampleTypeNumber, sample.BatchNumber);
                soilSample.LabNumber = sample.LabNumber;
                sample.ReportCost = GetReportCost(sample.SampleTypeNumber, sample.ReportTypeNumber, sample.CostTypeNumber);
                InvoiceModels invoice = GetInvoice(sample.CustomerNumber, sample.BatchNumber, sample.SampleTypeNumber);
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
        #endregion
        #region "Update Sample"
        [HttpPost]
        public JsonResult UpdateSample(SampleModels sample, SoilSampleModels soilSample, List<SoilSampleRecModels> sampleRecs)
        {
            Debug.Print("Starting sample update.....");
            
            SampleResult sr = new SampleResult();
            EntryReturn entry = new EntryReturn();
            entry.SampleTypes = db.SampleTypes.ToList();
           
            SampleModels oldSample = (from s in db.Samples
                                      where s.SampleTypeNumber == sample.SampleTypeNumber && s.BatchNumber == sample.BatchNumber && s.LabNumber == sample.LabNumber
                                      select s).SingleOrDefault();
            sr = ValidateSample(sample);
            if (sr.ValidSample)
            {  // need to get new or existing invoice is batch or customer numbers change
                InvoiceModels invoice = new InvoiceModels();
                if (oldSample.BatchNumber != sample.BatchNumber)
                {
                    invoice = GetInvoice(sample.CustomerNumber, sample.BatchNumber, sample.SampleTypeNumber);
                    if (invoice == null)
                    {
                        invoice = CreateInvoice(sample);
                        db.Invoices.Add(invoice);
                    }
                }
                else if (oldSample.CustomerNumber != sample.CustomerNumber)
                {
                    invoice = CreateInvoice(sample);
                    db.Invoices.Add(invoice);
                }
                sample.InvoiceNumber = invoice.InvoiceNumber;
                sample.DateReported = invoice.DateReported;
                
                // Get new report cost if RTN or cost type changes
                if (oldSample.ReportTypeNumber != sample.ReportTypeNumber || oldSample.CostTypeNumber != sample.CostTypeNumber)
                {
                    sample.ReportCost = GetReportCost(sample.SampleTypeNumber, sample.CostTypeNumber, sample.ReportTypeNumber);
                }

                if (LabNumberExists(sample.SampleTypeNumber, sample.BatchNumber, sample.LabNumber, sample.CustomerNumber) && oldSample.LabNumber != sample.LabNumber)
                {
                    sr.ValidSample = false;
                    sr.Message = "LabNumber already exists";
                }
                else
                {
                    oldSample = sample;
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
            if (!Validator.isNumeric(sample.CostTypeNumber.ToString()))
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