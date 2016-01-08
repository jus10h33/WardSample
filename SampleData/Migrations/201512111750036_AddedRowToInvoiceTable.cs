namespace SampleData.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddedRowToInvoiceTable : DbMigration
    {
        public override void Up()
        {
            DropTable("dbo.InvoiceModels");
            CreateTable(
                "dbo.InvoiceModels",
                c => new
                {
                    Row = c.Int(identity: true),
                    InvoiceNumber = c.Int(nullable: false),
                    CustomerNumber = c.Int(nullable: false),
                    SampleTypeNumber = c.Int(nullable: false),
                    BatchNumber = c.Int(nullable: false),
                    DateReported = c.DateTime(nullable: false),
                    PostageCost = c.Double(),
                    Comments = c.String(),
                    CustomerDiscount = c.Double(),
                    Locked = c.Byte(),
                })
                .PrimaryKey(t => new { t.CustomerNumber, t.SampleTypeNumber, t.BatchNumber });
        }
        
        public override void Down()
        {
            DropTable("dbo.InvoiceModels");
        }
    }
}
