using SampleData.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Core.Objects;
using System.Data.Entity.Infrastructure;
using System.Data.Entity.ModelConfiguration.Conventions;

namespace SampleData.DAL
{
    public class WardDBContext : DbContext
    {

        public WardDBContext() : base("WardDBContext")
        {
        }

        public DbSet<CustomerModels> Customers { get; set; }
        public DbSet<SampleModels> Samples { get; set; }
        public DbSet<InvoiceModels> Invoices { get; set; }
        public DbSet<SampleTypeModels> SampleTypes { get; set; }
        public DbSet<ReportItemModels> ReportItems { get; set; }
        public DbSet<ReportItemTestModels> ReportItemTests { get; set; }
        public DbSet<ReportModels> Reports { get; set; }
        public DbSet<ReportReportItemModels> ReportReportItems { get; set; }
        public DbSet<TestItemModels> TestItems { get; set; }
        public DbSet<SampleColumns> SampleColumns { get; set; }
        public DbSet<SoilSampleRecModels> SoilSampleRecs { get; set; }
        public DbSet<SoilSampleModels> SoilSamples { get; set; }
        public DbSet<SoilRecTypeModels> SoilRecTypes { get; set; }
        public DbSet<SoilRecCropModels> SoilRecCrops { get; set; }
        public DbSet<PastCropModels> PastCrops { get; set; }
        public DbSet<OldInvoiceTable> OldInvoices { get; set; }
        public DbSet<w_Samples> OldSamples { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
        }        
    }

    public class Ward2004DBContext : DbContext
    {

        public Ward2004DBContext() : base("Ward2004DBContext")
        {
        }

        public DbSet<w_Samples> WardSamples { get; set; }
        

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            //modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
        }
    }
}