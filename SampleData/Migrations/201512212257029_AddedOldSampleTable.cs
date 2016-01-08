namespace SampleData.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddedOldSampleTable : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.OldSampleTable",
                c => new
                    {
                        SampleTypeNumber = c.Int(nullable: false),
                        BatchNumber = c.Int(nullable: false),
                        LabNumber = c.Int(nullable: false),
                        CustomerNumber = c.Int(nullable: false),
                        InvoiceNumber = c.Int(nullable: false),
                        DateReceived = c.Int(),
                        ReportTypeNumber = c.Int(nullable: false),
                        ReportCost = c.Double(),
                        ResultsFor = c.String(),
                        SampleID1 = c.String(),
                        SampleID2 = c.String(),
                        SampleID3 = c.String(),
                        SampleID4 = c.String(),
                        Reviewed = c.Int(),
                        Emailed = c.Int(),
                        Uploaded = c.Int(),
                        Faxed = c.Int(),
                        Hold = c.Int(),
                        StandardCost = c.Int(),
                        Status = c.Int(),
                        LastModified = c.DateTime(),
                        ReviewerID = c.Int(),
                    })
                .PrimaryKey(t => new { t.SampleTypeNumber, t.BatchNumber, t.LabNumber });
            
        }
        
        public override void Down()
        {
            DropTable("dbo.OldSampleTable");
        }
    }
}
