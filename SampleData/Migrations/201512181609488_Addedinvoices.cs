namespace SampleData.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Addedinvoices : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.OldInvoiceTable",
                c => new
                    {
                        CustomerNumber = c.Int(nullable: false),
                        SampleTypeNumber = c.Int(nullable: false),
                        BatchNumber = c.Int(nullable: false),
                        InvoiceNumber = c.Int(nullable: false),
                        DateReported = c.Int(),
                        PostageCost = c.Double(),
                        Comments = c.String(),
                        CustomerDiscount = c.Double(),
                        Locked = c.Byte(),
                    })
                .PrimaryKey(t => new { t.CustomerNumber, t.SampleTypeNumber, t.BatchNumber });
            
        }
        
        public override void Down()
        {
            DropTable("dbo.OldInvoiceTable");
        }
    }
}
