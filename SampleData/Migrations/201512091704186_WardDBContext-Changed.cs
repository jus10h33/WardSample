namespace SampleData.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class WardDBContextChanged : DbMigration
    {
        public override void Up()
        {
            DropTable("dbo.ReportReportItemModels");
            DropTable("dbo.ReportItemModels");
            CreateTable(
                "dbo.ReportItemModels",
                c => new
                    {
                        SampleTypeNumber = c.Int(nullable: false),
                        ReportItemNumber = c.Int(nullable: false),
                        ReportItemName = c.String(),
                        ReportItemDisplay = c.String(),
                        ReportItemCost = c.Double(nullable: false),
                        EquationNumber = c.Int(nullable: false),
                        ReportItemDecimals = c.Int(nullable: false),
                        MinimumValue = c.Double(nullable: false),
                        ReportOrder = c.Int(nullable: false),
                    })
                .PrimaryKey(t => new { t.SampleTypeNumber, t.ReportItemNumber });
            
            CreateTable(
                "dbo.ReportReportItemModels",
                c => new
                    {
                        SampleTypeNumber = c.Int(nullable: false),
                        ReportTypeNumber = c.Int(nullable: false),
                        ReportItemNumber = c.Int(nullable: false),
                    })
                .PrimaryKey(t => new { t.SampleTypeNumber, t.ReportTypeNumber, t.ReportItemNumber });
            
        }
        
        public override void Down()
        {
            DropTable("dbo.ReportReportItemModels");
            DropTable("dbo.ReportItemModels");
        }
    }
}
