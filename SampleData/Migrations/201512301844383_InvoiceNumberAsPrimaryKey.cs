namespace SampleData.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class InvoiceNumberAsPrimaryKey : DbMigration
    {
        public override void Up()
        {
            DropPrimaryKey("dbo.InvoiceModels");
            AddPrimaryKey("dbo.InvoiceModels", new[] { "InvoiceNumber", "CustomerNumber", "SampleTypeNumber", "BatchNumber" });
        }
        
        public override void Down()
        {
            DropPrimaryKey("dbo.InvoiceModels");
            AddPrimaryKey("dbo.InvoiceModels", new[] { "CustomerNumber", "SampleTypeNumber", "BatchNumber" });
        }
    }
}
