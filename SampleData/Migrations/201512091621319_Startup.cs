namespace SampleData.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Startup : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.CustomerModels",
                c => new
                    {
                        CustomerNumber = c.Int(nullable: false, identity: true),
                        LastName = c.String(),
                        FirstName = c.String(),
                        Company = c.String(),
                        Address1 = c.String(),
                        Address2 = c.String(),
                        City = c.String(),
                        State = c.String(),
                        Zip = c.String(),
                        Country = c.String(),
                        BillToCompany = c.Int(),
                        Discount = c.Double(),
                        ActiveCustomer = c.Int(),
                        Mailresults = c.Int(),
                        MailedCopies = c.Int(),
                        FaxResults = c.Int(),
                        EmailResults = c.Int(),
                        PostResultsToWeb = c.Int(),
                        Newsletter = c.Int(),
                        WardGuide = c.Int(),
                        ChristmasCard = c.Int(),
                        NamaCust = c.Int(),
                        SendPDF = c.Int(),
                        PrintPDFHeaderFooter = c.Int(),
                        EPAInfo = c.Int(),
                        PrintInvNow = c.Int(),
                        PrintInvLater = c.Int(),
                        SendInvoice = c.Int(),
                        SendTextData = c.Int(),
                        SplitGrowers = c.Int(),
                        SplitFields = c.Int(),
                        ExtraInformation = c.String(),
                        CustomerStatus = c.Int(),
                        LastModified = c.DateTime(),
                        MachineID = c.String(),
                        UserID = c.String(),
                        SampleEntryInformation = c.String(),
                        CreatedOn = c.DateTime(),
                        ForceStandardSoilReport = c.Int(),
                    })
                .PrimaryKey(t => t.CustomerNumber);
            
            CreateTable(
                "dbo.InvoiceModels",
                c => new
                    {
                        InvoiceNumber = c.Int(nullable: false, identity: true),
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

            CreateTable(
                "dbo.ReportItemModels",
                c => new
                {
                    SampleTypeNumber = c.Int(nullable: false),
                    ReportItemNumber = c.Int(nullable: false),
                    ReportItemName = c.String(),
                    ReportItemDisplay = c.String(),
                    ReportItemCost = c.Double(),
                    EquationNumber = c.Int(),
                    ReportItemDecimals = c.Double(),
                    MinimumValue = c.Double(),
                    ReportOrder = c.Int(),
                })
                .PrimaryKey(t => new { t.SampleTypeNumber, t.ReportItemNumber });

            CreateTable(
                "dbo.ReportItemTestModels",
                c => new
                    {
                        SampleTypeNumber = c.Int(nullable: false),
                        ReportItemNumber = c.Int(nullable: false),
                        TestItemNumber = c.Int(nullable: false),
                    })
                .PrimaryKey(t => new { t.SampleTypeNumber, t.ReportItemNumber, t.TestItemNumber });
            
            CreateTable(
                "dbo.ReportModels",
                c => new
                    {
                        SampleTypeNumber = c.Int(nullable: false),
                        ReportTypeNumber = c.Int(nullable: false),
                        ReportName = c.String(),
                        StandardCost = c.Double(),
                        PrimaryVolumeCost = c.Double(),
                        SecondaryVolumeCost = c.Double(),
                        FileReferenceNumber = c.Int(),
                        SplitOverride = c.Int(),
                        Description = c.String(),
                    })
                .PrimaryKey(t => new { t.SampleTypeNumber, t.ReportTypeNumber });

            CreateTable(
                "dbo.ReportReportItemModels",
                c => new
                {
                    SampleTypeNumber = c.Int(nullable: false),
                    ReportTypeNumber = c.Int(nullable: false),
                    ReportItemNumber = c.Int(nullable: false),
                })
                .PrimaryKey(t => new { t.SampleTypeNumber, t.ReportTypeNumber, t.ReportItemNumber });

            CreateTable(
                "dbo.SampleModels",
                c => new
                    {
                        SampleTypeNumber = c.Int(nullable: false),
                        BatchNumber = c.Int(nullable: false),
                        LabNumber = c.Int(nullable: false),
                        CustomerNumber = c.Int(nullable: false),
                        InvoiceNumber = c.Int(nullable: false),
                        DateReceived = c.DateTime(nullable: false),
                        ReportTypeNumber = c.Int(),
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
            
            CreateTable(
                "dbo.SampleTypeModels",
                c => new
                    {
                        SampleTypeNumber = c.Int(nullable: false, identity: true),
                        SampleTypeName = c.String(),
                    })
                .PrimaryKey(t => t.SampleTypeNumber);
            
            CreateTable(
                "dbo.SoilSampleRecModels",
                c => new
                    {
                        BatchNumber = c.Int(nullable: false),
                        LabNumber = c.Int(nullable: false),
                        Priority = c.Int(),
                        RecTypeNumber = c.Int(),
                        CropTypeNumber = c.Int(),
                        YieldGoal = c.Int(),
                    })
                .PrimaryKey(t => new { t.BatchNumber, t.LabNumber });
            
            CreateTable(
                "dbo.TestItemModels",
                c => new
                    {
                        SampleTypeNumber = c.Int(nullable: false),
                        TestItemNumber = c.Int(nullable: false),
                        TestItemName = c.String(),
                        EquationNumber = c.Int(),
                    })
                .PrimaryKey(t => new { t.SampleTypeNumber, t.TestItemNumber });
            
        }
        
        public override void Down()
        {
            DropTable("dbo.TestItemModels");
            DropTable("dbo.SoilSampleRecModels");
            DropTable("dbo.SampleTypeModels");
            DropTable("dbo.SampleModels");
            DropTable("dbo.ReportModels");
            DropTable("dbo.ReportItemTestModels");
            DropTable("dbo.InvoiceModels");
            DropTable("dbo.CustomerModels");
        }
    }
}
