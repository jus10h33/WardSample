//using System;
//using System.Collections.Generic;
//using System.Data;
//using System.Data.Entity;
//using System.Linq;
//using System.Net;
//using System.Text;
//using System.Web.Mvc;
//using SampleData.DAL;
//using SampleData.Models;
//using SampleData.Helpers;
//using System.Web.Script.Serialization;
//using System.Diagnostics;
//using System.Text.RegularExpressions;

//namespace SampleData.Controllers
//{
//    public class SampleModelsControllerBak : Controller
//    {
//        private WardDBContext db = new WardDBContext();
//        private Ward2004DBContext wardDB = new Ward2004DBContext();
//        EntryReturn entry = new EntryReturn();

//        // GET: SampleModels
//        public ActionResult Index()
//        {
//            return View();
//        }

//        // GET: SampleModels/Entry
//        public ActionResult Entry()
//        {

//            //int count = 1;
//            //List<w_Samples> oldSamples = wardDB.WardSamples.ToList();
//            //List<SampleModels> samples = new List<SampleModels>();
//            //foreach (w_Samples o in oldSamples)
//            //{
//            //    int year = Convert.ToInt32(o.DateReceived.ToString().Substring(0, 4));
//            //    int month = Convert.ToInt32(o.DateReceived.ToString().Substring(4, 2));
//            //    int day = Convert.ToInt32(o.DateReceived.ToString().Substring(6, 2));
//            //    DateTime newDR = new DateTime(year, month, day);
//            //    SampleModels sample = new SampleModels();
//            //    sample.SampleTypeNumber = o.SampleTypeNumber;
//            //    sample.BatchNumber = o.BatchNumber;
//            //    sample.LabNumber = o.LabNumber;
//            //    sample.CustomerNumber = o.CustomerNumber;
//            //    sample.InvoiceNumber = o.InvoiceNumber;
//            //    sample.DateReceived = newDR;
//            //    sample.ReportTypeNumber = o.ReportTypeNumber;
//            //    sample.ReportCost = o.ReportCost;
//            //    sample.ResultsFor = o.ResultsFor;
//            //    sample.SampleID1 = o.SampleID1;
//            //    sample.SampleID2 = o.SampleID2;
//            //    sample.SampleID3 = o.SampleID3;
//            //    sample.SampleID4 = o.SampleID4;
//            //    sample.Reviewed = o.Reviewed;
//            //    sample.Emailed = o.Emailed;
//            //    sample.Uploaded = o.Uploaded;
//            //    sample.Faxed = o.Faxed;
//            //    sample.Hold = o.Hold;
//            //    sample.StandardCost = o.StandardCost;
//            //    sample.Status = o.Status;
//            //    sample.LastModified = o.LastModified;
//            //    sample.ReviewerID = o.ReviewerID;
//            //    db.Samples.Add(sample);
//            //    Debug.Print(count.ToString());
//            //    count++;
//            //}
//            //db.SaveChanges();
//            //Debug.Print(count.ToString());

//            //int count2 = 1;
//            //List<OldInvoiceTable> oldInvoices = db.OldInvoices.ToList();
//            //List<InvoiceModels> invoices = new List<InvoiceModels>();
//            //foreach (OldInvoiceTable o in oldInvoices)
//            //{
//            //    if (count > 6095)
//            //    {
//            //        int year = Convert.ToInt32(o.DateReported.ToString().Substring(0, 4));
//            //        int month = Convert.ToInt32(o.DateReported.ToString().Substring(4, 2));
//            //        int day = Convert.ToInt32(o.DateReported.ToString().Substring(6, 2));
//            //        DateTime newDR = new DateTime(year, month, day);
//            //        InvoiceModels invoice = new InvoiceModels();
//            //        invoice.BatchNumber = o.BatchNumber;
//            //        invoice.CustomerNumber = o.CustomerNumber;
//            //        invoice.InvoiceNumber = o.InvoiceNumber;
//            //        invoice.DateReported = newDR;
//            //        invoice.CustomerDiscount = o.CustomerDiscount;
//            //        invoice.Comments = o.Comments;
//            //        invoice.SampleTypeNumber = o.SampleTypeNumber;
//            //        invoice.Locked = o.Locked;
//            //        invoice.PostageCost = o.PostageCost;
//            //        db.Invoices.Add(invoice);
//            //        Debug.Print(count.ToString());
//            //    }
//            //    count2++;
//            //}
//            //db.SaveChanges();
//            //Debug.Print(count2.ToString());

//            return View();
//        }

//        /*
//         * 1. Sample Types
//         * 2. Sample
//         *   - get from cache
//         *   - or load last sample entered for that sampletype
//         * 3. Customer info - user customer number from sample
//         * 4. TestItemName
//         * 5. ResultFor for customernumber and sampletypenumber
//         * 6. Soil Sample Recommendations for sample( from step 2 )
//         */

//        public JsonResult Load(int sampleTypeNumber = 1)
//        {
//            try
//            {
//                // 1. Get SampleTypes
//                List<SampleTypeModels> types = db.SampleTypes.ToList();
//                entry.SampleTypes = types;

//                // 2. Get Sample
//                entry.Sample = (from s in db.Samples
//                                where s.SampleTypeNumber == sampleTypeNumber
//                                orderby s.BatchNumber descending, s.LabNumber descending
//                                select s).FirstOrDefault();

//                // 3. Get Customer
//                entry.Customer = (from c in db.Customers
//                                  where c.CustomerNumber == entry.Sample.CustomerNumber
//                                  select c).FirstOrDefault();

//                // 4. Get Report
//                entry.Report = (from r in db.Reports
//                                where r.SampleTypeNumber == entry.Sample.SampleTypeNumber & r.ReportTypeNumber == entry.Sample.ReportTypeNumber
//                                select r).FirstOrDefault();

//                // 5. Get ResultsFor for customer
//                entry.ResultFors = (from rf in db.Samples
//                                    where rf.CustomerNumber == entry.Sample.CustomerNumber && rf.SampleTypeNumber == entry.Sample.SampleTypeNumber
//                                    select rf.ResultsFor).ToList();

//                // 6. Get Invoice
//                entry.Invoice = (from i in db.Invoices
//                                 where i.InvoiceNumber == entry.Sample.InvoiceNumber
//                                 select i).FirstOrDefault();

//                //----Get Dynamic Columns
//                entry.SampleColumns = (from sc in db.SampleColumns
//                                       where sc.SampleTypeNumber == entry.Sample.SampleTypeNumber
//                                       orderby sc.ColumnOrder
//                                       select sc).ToList();

//                // 6. Get Soil Sample Recs, crop types, rec types
//                List<SoilSampleRecModels> soilSampleRecs = (from ssr in db.SoilSampleRecs
//                                                            where ssr.BatchNumber == entry.Sample.BatchNumber && ssr.LabNumber == entry.Sample.LabNumber
//                                                            select ssr).ToList();

//                entry.SoilSample = (from ss in db.SoilSamples
//                                    where (ss.BatchNumber == entry.Sample.BatchNumber && ss.LabNumber == entry.Sample.LabNumber)
//                                    orderby ss.BeginningDepth ascending
//                                    select ss).SingleOrDefault();

//                entry.SoilSamples = new List<SoilSampleModels>();
//                List<SoilSampleModels> soilSamples = new List<SoilSampleModels>();

//                if (entry.SoilSample.LinkedSampleLab == 0)
//                {
//                    soilSamples = (from ss in db.SoilSamples
//                                   where (ss.BatchNumber == entry.SoilSample.BatchNumber && ss.LabNumber == entry.SoilSample.LabNumber || (ss.LinkedSampleBatch == entry.SoilSample.BatchNumber && ss.LinkedSampleLab == entry.SoilSample.LabNumber))
//                                   orderby ss.BeginningDepth ascending
//                                   select ss).ToList();
//                }
//                else
//                {
//                    soilSamples = (from ss in db.SoilSamples
//                                   where (ss.BatchNumber == entry.SoilSample.LinkedSampleBatch && ss.LabNumber == entry.SoilSample.LinkedSampleLab) || (ss.LinkedSampleBatch == entry.SoilSample.LinkedSampleBatch && ss.LinkedSampleLab == entry.SoilSample.LinkedSampleLab)
//                                   orderby ss.BeginningDepth ascending
//                                   select ss).ToList();
//                }

//                foreach (SoilSampleModels ssm in soilSamples)
//                {
//                    entry.SoilSamples.Add(ssm);
//                    Debug.Print("LabNumber: " + ssm.LabNumber + ",  Beginning Depth: " + ssm.BeginningDepth);
//                }

//                entry.SoilRecCrops = (from x in db.SoilRecCrops
//                                      orderby x.CropTypeName
//                                      select x).ToList();
//                entry.SoilRecTypes = (from y in db.SoilRecTypes
//                                      orderby y.RecTypeName
//                                      select y).ToList();
//                entry.Recommendations = new List<Recommendations>();
//                foreach (SoilSampleRecModels r in soilSampleRecs)
//                {
//                    Recommendations rec = new Recommendations();
//                    rec.BatchNumber = r.BatchNumber;
//                    rec.LabNumber = r.LabNumber;
//                    rec.Priority = r.Priority;
//                    rec.RecTypeNumber = r.RecTypeNumber;
//                    rec.CropTypeNumber = r.CropTypeNumber;
//                    rec.YieldGoal = r.YieldGoal;
//                    rec.RecTypeName = (from x in entry.SoilRecTypes
//                                       where x.RecTypeNumber == rec.RecTypeNumber
//                                       select x.RecTypeName).SingleOrDefault();
//                    rec.CropTypeName = (from y in entry.SoilRecCrops
//                                        where y.CropTypeNumber == rec.CropTypeNumber
//                                        select y.CropTypeName).SingleOrDefault();
//                    entry.Recommendations.Add(rec);
//                    Debug.Print(rec.ToString());
//                }

//                entry.PastCrops = db.PastCrops.ToList();
//                entry.PastCropName = (from pc in entry.PastCrops
//                                      where pc.PastCropNumber == entry.SoilSamples[0].PastCropNumber
//                                      select pc.PastCropName).SingleOrDefault();
//            }
//            catch (Exception e)
//            {
//                Debug.Print("Exception occurred:  " + e.ToString());
//                entry = new EntryReturn();
//            }

//            return Json(entry, JsonRequestBehavior.AllowGet);
//        }

//        public JsonResult FindCustomer(int customerNumber)
//        {
//            if (customerNumber.Equals(System.DBNull.Value))
//            {
//                return Json("HTTP Bad Request", JsonRequestBehavior.AllowGet);
//            }
//            CustomerModels customer = new CustomerModels();
//            customer = CustomerExist(customerNumber);
//            if (customer == null)
//            {
//                return Json("Customer Not Found", JsonRequestBehavior.AllowGet);
//            }
//            else
//            {
//                return Json(customer, JsonRequestBehavior.AllowGet);
//            }
//        }
//        public JsonResult GetSampleTypes()
//        {
//            try
//            {
//                List<SampleTypeModels> types = db.SampleTypes.ToList();
//                return Json(types, JsonRequestBehavior.AllowGet);
//            }
//            catch (Exception)
//            {
//                return null;
//            }
//        }
//        [HttpPost]
//        public JsonResult GetColumns(int stn)
//        {
//            try
//            {
//                List<SampleColumns> sampleColumns = (from sc in db.SampleColumns
//                                                     where sc.SampleTypeNumber == stn
//                                                     orderby sc.ColumnOrder
//                                                     select sc).ToList();
//                return Json(sampleColumns, JsonRequestBehavior.AllowGet);
//            }
//            catch (Exception)
//            {
//                return null;
//            }
//        }
//        public string GetReportName(int sampleTypeNumber, int reportTypeNumber)
//        {
//            if (Validator.isNumeric(sampleTypeNumber.ToString()) && Validator.isNumeric(reportTypeNumber.ToString()))
//            {
//                try
//                {
//                    string reportName = (from r in db.Reports
//                                         where r.SampleTypeNumber == sampleTypeNumber && r.ReportTypeNumber == 99
//                                         select r.ReportName).FirstOrDefault();
//                    return reportName;
//                }
//                catch (Exception e)
//                {
//                    Debug.Print("reportItems list returned exception.  " + e.ToString());
//                }
//            }
//            else
//            {
//                Debug.Print("ReportTypeNumber is not numeric.");
//            }
//            return null;
//        }

//        public JsonResult GetResultsFor(int customerNumber, int sampleTypeNumber)
//        {
//            if (Validator.isNumeric(customerNumber.ToString()) && Validator.isNumeric(sampleTypeNumber.ToString()))
//            {
//                List<string> lstResultsFor = new List<string>();
//                try
//                {
//                    var y = db.Samples
//                      .Where(c => c.CustomerNumber == customerNumber && c.SampleTypeNumber == sampleTypeNumber)
//                      .Select(g => g.ResultsFor)
//                      .ToList().Distinct();
//                    foreach (var s in y)
//                    {
//                        lstResultsFor.Add(s.ToString());
//                    }
//                    return Json(lstResultsFor, JsonRequestBehavior.AllowGet);
//                }
//                catch (Exception)
//                {
//                    return null;
//                }
//            }
//            else
//                return null;
//        }

//        [HttpPost]
//        public JsonResult FindSample(int sampleTypeNumber, int batchNumber, int labNumber)
//        {
//            if (batchNumber.ToString().Length == 8 && Validator.isNumeric(batchNumber.ToString()) && Validator.isNumeric(labNumber.ToString()) && labNumber != 0)
//            {
//                try
//                {
//                    entry.SampleTypes = db.SampleTypes.ToList();
//                    entry.Sample = db.Samples.Find(sampleTypeNumber, batchNumber, labNumber);
//                    if (entry.Sample != null)
//                    {
//                        entry.Invoice = db.Invoices.Find(entry.Sample.CustomerNumber, sampleTypeNumber, batchNumber);
//                        entry.Customer = db.Customers.Find(entry.Sample.CustomerNumber);
//                        entry.Report = new ReportModels();
//                        entry.Report.ReportTypeNumber = entry.Sample.ReportTypeNumber;
//                        entry.Report.ReportName = GetReportName(entry.Sample.SampleTypeNumber, entry.Sample.ReportTypeNumber);
//                        entry.ResultFors = (from rf in db.Samples
//                                            where rf.CustomerNumber == entry.Customer.CustomerNumber && rf.SampleTypeNumber == sampleTypeNumber
//                                            select rf.ResultsFor).ToList();

//                        //----Get Dynamic Columns
//                        entry.SampleColumns = (from sc in db.SampleColumns
//                                               where sc.SampleTypeNumber == sampleTypeNumber
//                                               orderby sc.ColumnOrder
//                                               select sc).ToList();

//                        // 6. Get Soil Sample Recs, crop types, rec types
//                        List<SoilSampleRecModels> soilSampleRecs = (from ssr in db.SoilSampleRecs
//                                                                    where ssr.BatchNumber == entry.Sample.BatchNumber && ssr.LabNumber == entry.Sample.LabNumber
//                                                                    select ssr).ToList();

//                        entry.SoilSample = (from ss in db.SoilSamples
//                                            where (ss.BatchNumber == entry.Sample.BatchNumber && ss.LabNumber == entry.Sample.LabNumber)
//                                            orderby ss.BeginningDepth ascending
//                                            select ss).SingleOrDefault();

//                        entry.SoilSamples = new List<SoilSampleModels>();
//                        List<SoilSampleModels> soilSamples = new List<SoilSampleModels>();

//                        if (entry.SoilSample.LinkedSampleLab == 0)
//                        {
//                            soilSamples = (from ss in db.SoilSamples
//                                           where (ss.BatchNumber == entry.SoilSample.BatchNumber && ss.LabNumber == entry.SoilSample.LabNumber || (ss.LinkedSampleBatch == entry.SoilSample.BatchNumber && ss.LinkedSampleLab == entry.SoilSample.LabNumber))
//                                           orderby ss.BeginningDepth ascending
//                                           select ss).ToList();
//                        }
//                        else
//                        {
//                            soilSamples = (from ss in db.SoilSamples
//                                           where (ss.BatchNumber == entry.SoilSample.LinkedSampleBatch && ss.LabNumber == entry.SoilSample.LinkedSampleLab) || (ss.LinkedSampleBatch == entry.SoilSample.LinkedSampleBatch && ss.LinkedSampleLab == entry.SoilSample.LinkedSampleLab)
//                                           orderby ss.BeginningDepth ascending
//                                           select ss).ToList();
//                        }

//                        foreach (SoilSampleModels ssm in soilSamples)
//                        {
//                            entry.SoilSamples.Add(ssm);
//                            Debug.Print("LabNumber: " + ssm.LabNumber + ",  Beginning Depth: " + ssm.BeginningDepth);
//                        }

//                        entry.SoilRecCrops = db.SoilRecCrops.ToList();
//                        List<SoilRecTypeModels> recTypes = db.SoilRecTypes.ToList();
//                        entry.Recommendations = new List<Recommendations>();
//                        foreach (SoilSampleRecModels r in soilSampleRecs)
//                        {
//                            Recommendations rec = new Recommendations();
//                            rec.BatchNumber = r.BatchNumber;
//                            rec.LabNumber = r.LabNumber;
//                            rec.Priority = r.Priority;
//                            rec.RecTypeNumber = r.RecTypeNumber;
//                            rec.CropTypeNumber = r.CropTypeNumber;
//                            rec.YieldGoal = r.YieldGoal;
//                            rec.RecTypeName = (from x in recTypes
//                                               where x.RecTypeNumber == rec.RecTypeNumber
//                                               select x.RecTypeName).SingleOrDefault();
//                            rec.CropTypeName = (from y in entry.SoilRecCrops
//                                                where y.CropTypeNumber == rec.CropTypeNumber
//                                                select y.CropTypeName).SingleOrDefault();
//                            entry.Recommendations.Add(rec);
//                            Debug.Print(rec.ToString());
//                        }

//                        entry.PastCrops = db.PastCrops.ToList();
//                        entry.PastCropName = (from pc in entry.PastCrops
//                                              where pc.PastCropNumber == entry.SoilSamples[0].PastCropNumber
//                                              select pc.PastCropName).SingleOrDefault();
//                    }
//                    return Json(entry, JsonRequestBehavior.AllowGet);
//                }
//                catch (Exception e)
//                {
//                    Debug.Print("Exception occurred in FindSample:  " + e.ToString());
//                    return null;
//                }
//            }
//            else
//            {
//                return null;
//            }
//        }

//        [HttpPost]
//        public JsonResult AddSample(SampleModels sample, InvoiceModels invoice, SoilSampleModels soilSample, List<SoilSampleRecModels> sampleRecs = null)
//        {
//            Debug.Print("sample.SampleTypeNumber: " + sample.SampleTypeNumber);
//            //SampleResult sr = new SampleResult();
//            //sr = ValidateSample(sample);
//            //if (sr.ValidSample)
//            //{
//            //    sample.LabNumber = GetLabNumber(sample.SampleTypeNumber, sample.BatchNumber);
//            //    sample.ReportCost = GetReportCost(sample);                
//            //    invoice = GetInvoice(sample);
//            //    if (invoice == null)
//            //    {
//            //        try
//            //        {
//            //            InvoiceModels newInvoice = CreateInvoice(sample);
//            //            if (newInvoice != null)
//            //            {
//            //                db.Invoices.Add(newInvoice);
//            //                sample.InvoiceNumber = newInvoice.InvoiceNumber;                           
//            //            }                            
//            //            else
//            //            {
//            //                sr.ValidInvoice = false;
//            //                sr.Message = "Invoice was not created.";
//            //                Debug.Print(sr.Message);
//            //            }                            
//            //        }
//            //        catch (Exception)
//            //        {
//            //            sr.Message = "Exception adding new invoice during AddSample routine";
//            //            Debug.Print(sr.Message);
//            //            sr.ValidInvoice = false;
//            //        }
//            //    }
//            //    else
//            //    {
//            //        Debug.Print("Invoice already exists. Setting invoice....");
//            //        sample.InvoiceNumber = invoice.InvoiceNumber;
//            //    }

//            //    if (ModelState.IsValid && sr.ValidInvoice)
//            //    {
//            //        // Add soilsample data and sampleRecs
//            //        db.SoilSamples.Add(soilSample);
//            //        foreach (SoilSampleRecModels soilRec in sampleRecs)
//            //        {
//            //            db.SoilSampleRecs.Add(soilRec);
//            //        }
//            //        sample = ConvertToUpperCase(sample);
//            //        db.Samples.Add(sample);
//            //        db.SaveChanges();
//            //        return Json(entry, JsonRequestBehavior.AllowGet);
//            //    }
//            //    else
//            //    {
//            //        if (!sr.ValidInvoice)
//            //        {
//            //            Debug.Print("*******************Hit !sr.ValidInvoice*****************");
//            //        }
//            //        else
//            //        {
//            //            sr.Message += "   :Invalid ModelState";
//            //        }
//            //    }
//            //}
//            //Debug.Print("Error adding Sample   ========>   " + sr.Message);
//            return null;
//        }
//        [HttpPost]
//        public JsonResult UpdateSample(SampleModels sample, InvoiceModels invoice, SoilSampleModels soilSample, List<SoilSampleRecModels> sampleRecs = null)
//        {
//            Debug.Print("Starting sample update.....");
//            SampleResult sr = new SampleResult();
//            entry.SampleTypes = db.SampleTypes.ToList();
//            sample.InvoiceNumber = invoice.InvoiceNumber;
//            entry.Sample = sample;
//            entry.Invoice = invoice;
//            SampleModels oldSample = (from s in db.Samples
//                                      where s.SampleTypeNumber == sample.SampleTypeNumber && s.BatchNumber == sample.BatchNumber && s.LabNumber == sample.LabNumber
//                                      select s).SingleOrDefault();
//            sr = ValidateSample(sample);
//            if (sr.ValidSample)
//            {  // need to get new or existing invoice is batch or customer numbers change
//                if (oldSample.BatchNumber != sample.BatchNumber)
//                {
//                    entry.Invoice = GetInvoice(sample);
//                    if (entry.Invoice == null)
//                    {
//                        entry.Invoice = CreateInvoice(sample);
//                    }
//                }
//                else if (oldSample.CustomerNumber != sample.CustomerNumber)
//                {
//                    entry.Invoice = CreateInvoice(sample);
//                    sample.InvoiceNumber = entry.Invoice.InvoiceNumber;
//                }
//                // Get new report cost if RTN or cost type changes
//                if (oldSample.ReportTypeNumber != sample.ReportTypeNumber || oldSample.StandardCost != sample.StandardCost)
//                {
//                    ReportModels report = (from r in db.Reports
//                                           where r.ReportTypeNumber == sample.ReportTypeNumber && r.SampleTypeNumber == sample.SampleTypeNumber
//                                           select r).SingleOrDefault();
//                    if (report != null)
//                    {
//                        if (sample.StandardCost == 1)
//                        {
//                            sample.ReportCost = report.StandardCost;
//                        }
//                        else if (sample.StandardCost == 2)
//                        {
//                            sample.ReportCost = report.PrimaryVolumeCost;
//                        }
//                    }
//                    else
//                    {
//                        //handle report being null
//                        //    sr.ValidSample = false;
//                        //    sr.Message = "Report not found.";
//                    }
//                }

//                if (LabNumberExists(sample.SampleTypeNumber, sample.BatchNumber, sample.LabNumber, sample.CustomerNumber) && oldSample.LabNumber != sample.LabNumber)
//                {
//                    sr.ValidSample = false;
//                    sr.Message = "LabNumber already exists";
//                }
//                else
//                {
//                    oldSample.SampleTypeNumber = sample.SampleTypeNumber;
//                    oldSample.BatchNumber = sample.BatchNumber;
//                    oldSample.CustomerNumber = sample.CustomerNumber;
//                    oldSample.LabNumber = sample.LabNumber;
//                    oldSample.ResultsFor = sample.ResultsFor;
//                    oldSample.SampleID1 = sample.SampleID1;
//                    oldSample.SampleID2 = sample.SampleID2;
//                    oldSample.SampleID3 = sample.SampleID3;
//                    oldSample.SampleID4 = sample.SampleID4;
//                    oldSample.ReportTypeNumber = sample.ReportTypeNumber;
//                    oldSample.DateReceived = sample.DateReceived;
//                    oldSample.StandardCost = sample.StandardCost;
//                    if (ModelState.IsValid)
//                    {
//                        oldSample = ConvertToUpperCase(oldSample);
//                        db.Entry(oldSample).State = EntityState.Modified;
//                        // Add soilsample data and sampleRecs
//                        SoilSampleModels ssample = db.SoilSamples.Find(sample.BatchNumber, sample.LabNumber); // Do I need to find it first
//                        db.SoilSamples.Remove(ssample);
//                        db.SoilSamples.Add(soilSample);
//                        List<SoilSampleRecModels> recs = (from r in db.SoilSampleRecs
//                                                          where r.BatchNumber == sample.BatchNumber && r.LabNumber == sample.LabNumber
//                                                          select r).ToList();
//                        foreach (SoilSampleRecModels soilRec in recs)
//                        {
//                            db.SoilSampleRecs.Remove(soilRec);
//                        }
//                        foreach (SoilSampleRecModels soilRec in sampleRecs)
//                        {
//                            db.SoilSampleRecs.Add(soilRec);
//                        }
//                        db.SaveChanges();


//                        Debug.Print("SAMPLE UPDATE COMPLETED-----------");
//                        entry.Report = (from r in db.Reports
//                                        where r.SampleTypeNumber == sample.SampleTypeNumber && r.ReportTypeNumber == sample.ReportTypeNumber
//                                        select r).SingleOrDefault();
//                        entry.Customer = (from c in db.Customers
//                                          where c.CustomerNumber == sample.CustomerNumber
//                                          select c).SingleOrDefault();
//                        // 6. Get Soil Sample Recs, crop types, rec types
//                        List<SoilSampleRecModels> soilSampleRecs = (from ssr in db.SoilSampleRecs
//                                                                    where ssr.BatchNumber == entry.Sample.BatchNumber && ssr.LabNumber == entry.Sample.LabNumber
//                                                                    select ssr).ToList();

//                        entry.SoilSample = (from ss in db.SoilSamples
//                                            where (ss.BatchNumber == entry.Sample.BatchNumber && ss.LabNumber == entry.Sample.LabNumber)
//                                            orderby ss.BeginningDepth ascending
//                                            select ss).SingleOrDefault();

//                        entry.SoilSamples = new List<SoilSampleModels>();
//                        List<SoilSampleModels> soilSamples = new List<SoilSampleModels>();

//                        if (entry.SoilSample.LinkedSampleLab == 0)
//                        {
//                            soilSamples = (from ss in db.SoilSamples
//                                           where (ss.BatchNumber == entry.SoilSample.BatchNumber && ss.LabNumber == entry.SoilSample.LabNumber || (ss.LinkedSampleBatch == entry.SoilSample.BatchNumber && ss.LinkedSampleLab == entry.SoilSample.LabNumber))
//                                           orderby ss.BeginningDepth ascending
//                                           select ss).ToList();
//                        }
//                        else
//                        {
//                            soilSamples = (from ss in db.SoilSamples
//                                           where (ss.BatchNumber == entry.SoilSample.LinkedSampleBatch && ss.LabNumber == entry.SoilSample.LinkedSampleLab) || (ss.LinkedSampleBatch == entry.SoilSample.LinkedSampleBatch && ss.LinkedSampleLab == entry.SoilSample.LinkedSampleLab)
//                                           orderby ss.BeginningDepth ascending
//                                           select ss).ToList();
//                        }

//                        foreach (SoilSampleModels ssm in soilSamples)
//                        {
//                            entry.SoilSamples.Add(ssm);
//                            Debug.Print("LabNumber: " + ssm.LabNumber + ",  Beginning Depth: " + ssm.BeginningDepth);
//                        }

//                        entry.SoilRecCrops = db.SoilRecCrops.ToList();
//                        List<SoilRecTypeModels> recTypes = db.SoilRecTypes.ToList();
//                        entry.Recommendations = new List<Recommendations>();
//                        foreach (SoilSampleRecModels r in soilSampleRecs)
//                        {
//                            Recommendations rec = new Recommendations();
//                            rec.BatchNumber = r.BatchNumber;
//                            rec.LabNumber = r.LabNumber;
//                            rec.Priority = r.Priority;
//                            rec.RecTypeNumber = r.RecTypeNumber;
//                            rec.CropTypeNumber = r.CropTypeNumber;
//                            rec.YieldGoal = r.YieldGoal;
//                            rec.RecTypeName = (from x in recTypes
//                                               where x.RecTypeNumber == rec.RecTypeNumber
//                                               select x.RecTypeName).SingleOrDefault();
//                            rec.CropTypeName = (from y in entry.SoilRecCrops
//                                                where y.CropTypeNumber == rec.CropTypeNumber
//                                                select y.CropTypeName).SingleOrDefault();
//                            entry.Recommendations.Add(rec);
//                            Debug.Print(rec.ToString());
//                        }

//                        entry.PastCrops = db.PastCrops.ToList();
//                        entry.PastCropName = (from pc in entry.PastCrops
//                                              where pc.PastCropNumber == entry.SoilSamples[0].PastCropNumber
//                                              select pc.PastCropName).SingleOrDefault();
//                        return Json(entry, JsonRequestBehavior.AllowGet);
//                    }
//                    else
//                    {
//                        Debug.Print("Invalid modelstate");
//                    }
//                }
//            }
//            Debug.Print(sr.Message);
//            return Json(entry, JsonRequestBehavior.AllowGet); ;
//        }

//        [HttpPost]
//        public JsonResult DeleteSample(int sampleTypeNumber, int batchNumber, int labNumber)
//        {
//            Debug.Print("Delete starting...");
//            if (Validator.isNumeric(sampleTypeNumber.ToString()) && Validator.isNumeric(batchNumber.ToString()) && Validator.isNumeric(labNumber.ToString()))
//            {
//                Debug.Print("Delete input is valid.");
//                SampleModels sample = db.Samples.Find(sampleTypeNumber, batchNumber, labNumber);
//                SoilSampleModels soilSample = db.SoilSamples.Find(batchNumber, labNumber); // Do I need to find it first
//                db.SoilSamples.Remove(soilSample);
//                List<SoilSampleRecModels> sampleRecs = (from sr in db.SoilSampleRecs
//                                                        where sr.BatchNumber == batchNumber && sr.LabNumber == labNumber
//                                                        select sr).ToList();
//                foreach (SoilSampleRecModels soilRec in sampleRecs)
//                {
//                    db.SoilSampleRecs.Remove(soilRec);
//                }

//                if (sample != null)
//                {
//                    Debug.Print("sample != null");
//                    db.Samples.Remove(sample);
//                    int invoiceCount = (from i in db.Samples
//                                        where i.InvoiceNumber == sample.InvoiceNumber
//                                        select i).Count();
//                    Debug.Print("Invoice count == " + invoiceCount);
//                    if (invoiceCount == 1)
//                    {
//                        InvoiceModels invoice = (from i in db.Invoices
//                                                 where i.InvoiceNumber == sample.InvoiceNumber
//                                                 select i).FirstOrDefault();
//                        db.Invoices.Remove(invoice);
//                    }
//                    db.SaveChanges();
//                    return Json(Load(), JsonRequestBehavior.AllowGet);
//                }
//                else
//                {
//                    Debug.Print("Sample does NOT exist");

//                }
//            }
//            else
//            {
//                Debug.Print("Input did not pass validation");
//            }
//            return null;
//        }
//        private SampleModels ConvertToUpperCase(SampleModels sample)
//        {
//            sample.ResultsFor = sample.ResultsFor.ToUpper();
//            sample.SampleID1 = sample.SampleID1.ToUpper();
//            sample.SampleID2 = sample.SampleID2.ToUpper();
//            if (Validator.isPresent(sample.SampleID3))
//            {
//                sample.SampleID3 = sample.SampleID3.ToUpper();
//            }
//            if (Validator.isPresent(sample.SampleID4))
//            {
//                sample.SampleID4 = sample.SampleID4.ToUpper();
//            }
//            return sample;
//        }
//        private SampleResult ValidateSample(SampleModels sample)
//        {
//            SampleResult sr = new SampleResult();
//            sr.ValidSample = true;
//            StringBuilder sbMessage = new StringBuilder();

//            //SampleTypeNumber
//            if (!Validator.isNumeric(sample.SampleTypeNumber.ToString()))
//            {
//                sr.ValidSample = false;
//                sbMessage.AppendLine("Sample Type Number required");
//            }

//            //BatchNumber            
//            if (!Validator.isNumeric(sample.BatchNumber.ToString()) || sample.BatchNumber.ToString().Length != 8)
//            {
//                sr.ValidSample = false;
//                sbMessage.AppendLine("Batch Number != Length.8");
//            }

//            //LabNumber
//            if (!Validator.isNumeric(sample.LabNumber.ToString()))
//            {
//                sr.ValidSample = false;
//                sbMessage.AppendLine("Lab Number must be numeric");
//            }

//            //Check if Sample exists
//            if (sr.ValidSample)
//            {
//                SampleExist(sample.SampleTypeNumber, sample.BatchNumber, sample.LabNumber);
//            }

//            //ReportTypeNumber            
//            if (Validator.isNumeric(sample.ReportTypeNumber.ToString()))
//            {
//                ReportTypeExist(sample.SampleTypeNumber, sample.ReportTypeNumber);
//            }
//            else
//            {
//                sr.ValidSample = false;
//                sbMessage.AppendLine("Report Type Number required");
//            }

//            //ResultsFor
//            if (!Validator.isPresent(sample.ResultsFor))
//            {
//                sr.ValidSample = false;
//                sbMessage.AppendLine("ResultsFor required");
//            }

//            //SampleID1
//            if (!Validator.isPresent(sample.SampleID1))
//            {
//                sr.ValidSample = false;
//                sbMessage.AppendLine("Location required");
//            }

//            //SampleID2
//            if (!Validator.isPresent(sample.SampleID2))
//            {
//                sr.ValidSample = false;
//                sbMessage.AppendLine("SampleID2 required");
//            }

//            //DateReceived
//            if (!Validator.isPresent(sample.DateReceived.ToString()))
//            {
//                sr.ValidSample = false;
//                sbMessage.AppendLine("Date Received required");
//            }

//            //CostType
//            if (!Validator.isNumeric(sample.StandardCost.ToString()))
//            {
//                sr.ValidSample = false;
//                sbMessage.AppendLine("Cost Type required");
//            }
//            sr.Message = sbMessage.ToString();
//            sr.Sample = sample;
//            return sr;
//        }
//        private double GetReportCost(SampleModels sample)
//        {
//            ReportModels report = (from r in db.Reports
//                                   where r.SampleTypeNumber == sample.SampleTypeNumber && r.ReportTypeNumber == sample.ReportTypeNumber
//                                   select r).SingleOrDefault();
//            if (sample.StandardCost == 1)
//            {
//                return report.StandardCost;
//            }
//            else if (sample.StandardCost == 2)
//            {
//                return report.PrimaryVolumeCost;
//            }
//            else
//            {
//                return 0;
//            }
//        }
//        public InvoiceModels GetInvoice(SampleModels sample)
//        {
//            //InvoiceNumber and Date Reported
//            try
//            {
//                InvoiceModels invoice = (from inv in db.Invoices
//                                         where inv.BatchNumber == sample.BatchNumber && inv.CustomerNumber == sample.CustomerNumber && inv.SampleTypeNumber == sample.SampleTypeNumber
//                                         select inv).FirstOrDefault();
//                return invoice;
//            }
//            catch (Exception e)
//            {
//                Debug.Print(e.ToString());
//                return null;
//            }
//        }
//        public InvoiceModels CreateInvoice(SampleModels sample)
//        {
//            Debug.Print("Creating invoice...");
//            try
//            {
//                int maxInvoice = (from i in db.Invoices
//                                  orderby i.InvoiceNumber descending
//                                  select i.InvoiceNumber).FirstOrDefault();
//                Debug.Print("Max InvoiceNumber returned:  " + maxInvoice);
//                InvoiceModels newInvoice = new InvoiceModels();
//                newInvoice.InvoiceNumber = maxInvoice + 1;
//                newInvoice.SampleTypeNumber = sample.SampleTypeNumber;
//                newInvoice.BatchNumber = sample.BatchNumber;
//                newInvoice.CustomerNumber = sample.CustomerNumber;
//                newInvoice.DateReported = new DateTime(Convert.ToInt32(sample.BatchNumber.ToString().Substring(0, 4)), Convert.ToInt32(sample.BatchNumber.ToString().Substring(4, 2)), Convert.ToInt32(sample.BatchNumber.ToString().Substring(6, 2)));
//                Debug.Print(newInvoice.DateReported.ToString());
//                CustomerModels customer = new CustomerModels();
//                customer = db.Customers.Find(sample.CustomerNumber);
//                newInvoice.CustomerDiscount = customer.Discount;
//                newInvoice.Comments = "0";
//                newInvoice.Locked = 0;
//                newInvoice.PostageCost = 0.0;
//                return newInvoice;

//            }
//            catch (Exception ex)
//            {
//                Debug.Print("Error occurred getting max invoice.  " + ex.ToString());
//                return null;
//            }
//        }

//        //LabNumber
//        public bool LabNumberExists(int stn, int bn, int ln, int cn)
//        {
//            try
//            {
//                string bnYear = bn.ToString().Substring(0, 4);
//                string bnMMDD = Regex.Replace(bn.ToString().Substring(4, 4), "[1-9]", "0");
//                int bnTmp = Convert.ToInt32(String.Concat(bnYear, bnMMDD));
//                SampleModels sample = (from s in db.Samples
//                                       where (s.SampleTypeNumber == stn && s.BatchNumber > bnTmp && s.LabNumber == ln) || s.SampleTypeNumber == stn && s.BatchNumber > bnTmp && s.LabNumber == ln && s.CustomerNumber == cn
//                                       select s).FirstOrDefault();
//                return true;
//            }
//            catch (Exception)
//            {
//                return false;
//            }
//        }

//        // Check if Sample exists
//        public bool SampleExist(int stn, int bn, int ln)
//        {
//            SampleModels s = db.Samples.Find(stn, bn, ln);
//            if (s != null)
//            {
//                return false;
//            }
//            return true;
//        }

//        //ReportTypeNumber            
//        public bool ReportTypeExist(int stn, int rtn)
//        {
//            try
//            {
//                ReportModels report = (from rr in db.Reports
//                                       where rr.SampleTypeNumber == stn && rr.ReportTypeNumber == rtn
//                                       select rr).FirstOrDefault();
//                return true;
//            }
//            catch (Exception)
//            {
//                return false;
//            }
//        }

//        //Check customer exists in DB
//        private CustomerModels CustomerExist(int customerNumber)
//        {
//            CustomerModels customer = db.Customers.Find(customerNumber);
//            if (customer != null)
//                return customer;
//            else
//                return null;
//        }

//        //Get LabNumber from DB
//        public int GetLabNumber(int stn, int bn)
//        {
//            try
//            {
//                string bnYear = bn.ToString().Substring(0, 4);
//                string bnMMDD = Regex.Replace(bn.ToString().Substring(4, 4), "[1-9]", "0");
//                int bnTmp = Convert.ToInt32(String.Concat(bnYear, bnMMDD));
//                Debug.Print("Concatenated Batch Number:  " + bnTmp);
//                int labNumber = (from s in db.Samples
//                                 where s.SampleTypeNumber == stn && s.BatchNumber > bnTmp
//                                 orderby s.LabNumber descending
//                                 select s.LabNumber).FirstOrDefault();
//                return labNumber + 1;
//            }
//            catch (Exception e)
//            {
//                Debug.Print("GetLabNumber error:  " + e.Message);
//                return 0;
//            }
//        }
//    }
//}
