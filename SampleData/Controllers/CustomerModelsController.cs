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
    public class AccountModelsController : Controller
    {
        private WardDBContext db = new WardDBContext();

        // GET: AccountModels
        public ActionResult Index()
        {
            return View(db.Accounts.ToList());
        }

        // GET: AccountModels/Details/5
        public ActionResult Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            AccountModels customerModels = db.Accounts.Find(id);
            if (customerModels == null)
            {
                return HttpNotFound();
            }
            return View(customerModels);
        }

        // GET: AccountModels/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: AccountModels/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "AccountNumber,LastName,FirstName,Company,Address1,Address2,City,State,Zip,Country,BillToCompany,Discount,ActiveAccount,Mailresults,MailedCopies,FaxResults,EmailResults,PostResultsToWeb,Newsletter,WardGuide,ChristmasCard,NamaCust,SendPDF,PrintPDFHeaderFooter,EPAInfo,PrintInvNow,PrintInvLater,SendInvoice,SendTextData,SplitGrowers,SplitFields,ExtraInformation,AccountStatus,LastModified,MachineID,UserID,SampleEntryInformation,CreatedOn,ForceStandardSoilReport")] AccountModels customerModels)
        {
            if (ModelState.IsValid)
            {
                db.Accounts.Add(customerModels);
                db.SaveChanges();
                return RedirectToAction("Index");
            }

            return View(customerModels);
        }

        // GET: AccountModels/Edit/5
        public ActionResult Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            AccountModels customerModels = db.Accounts.Find(id);
            if (customerModels == null)
            {
                return HttpNotFound();
            }
            return View(customerModels);
        }

        // POST: AccountModels/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "AccountNumber,LastName,FirstName,Company,Address1,Address2,City,State,Zip,Country,BillToCompany,Discount,ActiveAccount,Mailresults,MailedCopies,FaxResults,EmailResults,PostResultsToWeb,Newsletter,WardGuide,ChristmasCard,NamaCust,SendPDF,PrintPDFHeaderFooter,EPAInfo,PrintInvNow,PrintInvLater,SendInvoice,SendTextData,SplitGrowers,SplitFields,ExtraInformation,AccountStatus,LastModified,MachineID,UserID,SampleEntryInformation,CreatedOn,ForceStandardSoilReport")] AccountModels customerModels)
        {
            if (ModelState.IsValid)
            {
                db.Entry(customerModels).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(customerModels);
        }

        // GET: AccountModels/Delete/5
        public ActionResult Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            AccountModels customerModels = db.Accounts.Find(id);
            if (customerModels == null)
            {
                return HttpNotFound();
            }
            return View(customerModels);
        }

        // POST: AccountModels/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(int id)
        {
            AccountModels customerModels = db.Accounts.Find(id);
            db.Accounts.Remove(customerModels);
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
