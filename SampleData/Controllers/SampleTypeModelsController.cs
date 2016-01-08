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
    public class SampleTypeModelsController : Controller
    {
        private WardDBContext db = new WardDBContext();

        // GET: SampleTypeModels
        public ActionResult Index()
        {
            return View(db.SampleTypes.ToList());
        }

        // GET: SampleTypeModels/Details/5
        public ActionResult Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            SampleTypeModels sampleTypeModels = db.SampleTypes.Find(id);
            if (sampleTypeModels == null)
            {
                return HttpNotFound();
            }
            return View(sampleTypeModels);
        }

        // GET: SampleTypeModels/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: SampleTypeModels/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "SampleTypeNumber,SampleTypeName")] SampleTypeModels sampleTypeModels)
        {
            if (ModelState.IsValid)
            {
                db.SampleTypes.Add(sampleTypeModels);
                db.SaveChanges();
                return RedirectToAction("Index");
            }

            return View(sampleTypeModels);
        }

        // GET: SampleTypeModels/Edit/5
        public ActionResult Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            SampleTypeModels sampleTypeModels = db.SampleTypes.Find(id);
            if (sampleTypeModels == null)
            {
                return HttpNotFound();
            }
            return View(sampleTypeModels);
        }

        // POST: SampleTypeModels/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "SampleTypeNumber,SampleTypeName")] SampleTypeModels sampleTypeModels)
        {
            if (ModelState.IsValid)
            {
                db.Entry(sampleTypeModels).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(sampleTypeModels);
        }

        // GET: SampleTypeModels/Delete/5
        public ActionResult Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            SampleTypeModels sampleTypeModels = db.SampleTypes.Find(id);
            if (sampleTypeModels == null)
            {
                return HttpNotFound();
            }
            return View(sampleTypeModels);
        }

        // POST: SampleTypeModels/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(int id)
        {
            SampleTypeModels sampleTypeModels = db.SampleTypes.Find(id);
            db.SampleTypes.Remove(sampleTypeModels);
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
