using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using SampleData.DAL;
using SampleData.Models;

namespace SampleData.Controllers
{
    public class CustomerModelsController : Controller
    {
        private WardDBContext db = new WardDBContext();

        // GET: CustomerModels
        public ActionResult Index()
        {
            return View(db.Customers.ToList());
        }

        // GET: CustomerModels/Details/5
        public ActionResult Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            AccountModels customerModels = db.Customers.Find(id);
            if (customerModels == null)
            {
                return HttpNotFound();
            }
            return View(customerModels);
        }

        // GET: CustomerModels/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: CustomerModels/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "CustomerNumber,LastName,FirstName,Company,Address1,Address2,City,State,Zip,Country,BillToCompany,Discount,ActiveCustomer,Mailresults,MailedCopies,FaxResults,EmailResults,PostResultsToWeb,Newsletter,WardGuide,ChristmasCard,NamaCust,SendPDF,PrintPDFHeaderFooter,EPAInfo,PrintInvNow,PrintInvLater,SendInvoice,SendTextData,SplitGrowers,SplitFields,ExtraInformation,CustomerStatus,LastModified,MachineID,UserID,SampleEntryInformation,CreatedOn,ForceStandardSoilReport")] AccountModels customerModels)
        {
            if (ModelState.IsValid)
            {
                db.Customers.Add(customerModels);
                db.SaveChanges();
                return RedirectToAction("Index");
            }

            return View(customerModels);
        }

        // GET: CustomerModels/Edit/5
        public ActionResult Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            AccountModels customerModels = db.Customers.Find(id);
            if (customerModels == null)
            {
                return HttpNotFound();
            }
            return View(customerModels);
        }

        // POST: CustomerModels/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "CustomerNumber,LastName,FirstName,Company,Address1,Address2,City,State,Zip,Country,BillToCompany,Discount,ActiveCustomer,Mailresults,MailedCopies,FaxResults,EmailResults,PostResultsToWeb,Newsletter,WardGuide,ChristmasCard,NamaCust,SendPDF,PrintPDFHeaderFooter,EPAInfo,PrintInvNow,PrintInvLater,SendInvoice,SendTextData,SplitGrowers,SplitFields,ExtraInformation,CustomerStatus,LastModified,MachineID,UserID,SampleEntryInformation,CreatedOn,ForceStandardSoilReport")] AccountModels customerModels)
        {
            if (ModelState.IsValid)
            {
                db.Entry(customerModels).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(customerModels);
        }

        // GET: CustomerModels/Delete/5
        public ActionResult Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            AccountModels customerModels = db.Customers.Find(id);
            if (customerModels == null)
            {
                return HttpNotFound();
            }
            return View(customerModels);
        }

        // POST: CustomerModels/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(int id)
        {
            AccountModels customerModels = db.Customers.Find(id);
            db.Customers.Remove(customerModels);
            db.SaveChanges();
            return RedirectToAction("Index");
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
