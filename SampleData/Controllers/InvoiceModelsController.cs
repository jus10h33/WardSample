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
    public class InvoiceModelsController : Controller
    {
        private WardDBContext db = new WardDBContext();

        // GET: InvoiceModels
        public ActionResult Index()
        {
            return View(db.Invoices.ToList());
        }

        // GET: InvoiceModels/Details/5
        public ActionResult Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            InvoiceModels invoiceModels = db.Invoices.Find(id);
            if (invoiceModels == null)
            {
                return HttpNotFound();
            }
            return View(invoiceModels);
        }

        // GET: InvoiceModels/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: InvoiceModels/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "CustomerNumber,SampleTypeNumber,BatchNumber,InvoiceNumber,Address1,Address2,City,State,Zip,Country,BillToCompany,Discount,ActiveCustomer,Mailresults,MailedCopies,FaxResults,EmailResults,PostResultsToWeb,Newsletter,WardGuide,ChristmasCard")] InvoiceModels invoiceModels)
        {
            if (ModelState.IsValid)
            {
                db.Invoices.Add(invoiceModels);
                db.SaveChanges();
                return RedirectToAction("Index");
            }

            return View(invoiceModels);
        }

        // GET: InvoiceModels/Edit/5
        public ActionResult Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            InvoiceModels invoiceModels = db.Invoices.Find(id);
            if (invoiceModels == null)
            {
                return HttpNotFound();
            }
            return View(invoiceModels);
        }

        // POST: InvoiceModels/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "CustomerNumber,SampleTypeNumber,BatchNumber,InvoiceNumber,Address1,Address2,City,State,Zip,Country,BillToCompany,Discount,ActiveCustomer,Mailresults,MailedCopies,FaxResults,EmailResults,PostResultsToWeb,Newsletter,WardGuide,ChristmasCard")] InvoiceModels invoiceModels)
        {
            if (ModelState.IsValid)
            {
                db.Entry(invoiceModels).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(invoiceModels);
        }

        // GET: InvoiceModels/Delete/5
        public ActionResult Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            InvoiceModels invoiceModels = db.Invoices.Find(id);
            if (invoiceModels == null)
            {
                return HttpNotFound();
            }
            return View(invoiceModels);
        }

        // POST: InvoiceModels/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(int id)
        {
            InvoiceModels invoiceModels = db.Invoices.Find(id);
            db.Invoices.Remove(invoiceModels);
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
