namespace SampleData.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class GroupedByTypes : DbMigration
    {
        public override void Up()
        {
            RenameTable(name: "dbo.SoilSampleModels", newName: "SampleChainModels");
            DropPrimaryKey("dbo.InvoiceModels");
            CreateTable(
                "dbo.AccountModels",
                c => new
                    {
                        AccountNumber = c.Int(nullable: false, identity: true),
                        LastName = c.String(),
                        FirstName = c.String(),
                        Company = c.String(),
                        Address1 = c.String(),
                        Address2 = c.String(),
                        City = c.String(),
                        State = c.String(),
                        Zip = c.String(),
                        Country = c.String(),
                        BillToCompany = c.Int(nullable: false),
                        Discount = c.Double(nullable: false),
                        ActiveAccount = c.Int(nullable: false),
                        Mailresults = c.Int(nullable: false),
                        MailedCopies = c.Int(nullable: false),
                        FaxResults = c.Int(nullable: false),
                        EmailResults = c.Int(nullable: false),
                        PostResultsToWeb = c.Int(nullable: false),
                        Newsletter = c.Int(nullable: false),
                        WardGuide = c.Int(nullable: false),
                        ChristmasCard = c.Int(nullable: false),
                        NamaCust = c.Int(nullable: false),
                        SendPDF = c.Int(nullable: false),
                        PrintPDFHeaderFooter = c.Int(nullable: false),
                        EPAInfo = c.Int(nullable: false),
                        PrintInvNow = c.Int(nullable: false),
                        PrintInvLater = c.Int(nullable: false),
                        SendInvoice = c.Int(nullable: false),
                        SendTextData = c.Int(nullable: false),
                        SplitGrowers = c.Int(nullable: false),
                        SplitFields = c.Int(nullable: false),
                        ExtraInformation = c.String(),
                        AccountStatus = c.Int(nullable: false),
                        LastModified = c.DateTime(nullable: false),
                        MachineID = c.String(),
                        UserID = c.String(),
                        SampleEntryInformation = c.String(),
                        CreatedOn = c.DateTime(nullable: false),
                        ForceStandardSoilReport = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.AccountNumber);
            
            AddColumn("dbo.InvoiceModels", "AccountNumber", c => c.Int(nullable: false));
            AddColumn("dbo.InvoiceModels", "AccountDiscount", c => c.Double(nullable: false));
            AddColumn("dbo.SampleModels", "AccountNumber", c => c.Int(nullable: false));
            AddPrimaryKey("dbo.InvoiceModels", new[] { "InvoiceNumber", "AccountNumber", "SampleTypeNumber", "BatchNumber" });
            DropColumn("dbo.InvoiceModels", "CustomerNumber");
            DropColumn("dbo.InvoiceModels", "CustomerDiscount");
            DropColumn("dbo.SampleModels", "CustomerNumber");
            DropTable("dbo.CustomerModels");
            DropTable("dbo.OldInvoiceTable");
            DropTable("dbo.w_Samples");
        }
        
        public override void Down()
        {
            CreateTable(
                "dbo.w_Samples",
                c => new
                    {
                        SampleTypeNumber = c.Int(nullable: false),
                        BatchNumber = c.Int(nullable: false),
                        LabNumber = c.Int(nullable: false),
                        CustomerNumber = c.Int(nullable: false),
                        InvoiceNumber = c.Int(nullable: false),
                        DateReceived = c.Int(nullable: false),
                        ReportTypeNumber = c.Int(nullable: false),
                        ReportCost = c.Double(nullable: false),
                        ResultsFor = c.String(nullable: false),
                        SampleID1 = c.String(nullable: false),
                        SampleID2 = c.String(),
                        SampleID3 = c.String(),
                        SampleID4 = c.String(),
                        Reviewed = c.Int(nullable: false),
                        Emailed = c.Int(nullable: false),
                        Uploaded = c.Int(nullable: false),
                        Faxed = c.Int(nullable: false),
                        Hold = c.Int(nullable: false),
                        StandardCost = c.Int(nullable: false),
                        Status = c.Int(nullable: false),
                        LastModified = c.DateTime(nullable: false),
                        ReviewerID = c.Int(nullable: false),
                    })
                .PrimaryKey(t => new { t.SampleTypeNumber, t.BatchNumber, t.LabNumber });
            
            CreateTable(
                "dbo.OldInvoiceTable",
                c => new
                    {
                        CustomerNumber = c.Int(nullable: false),
                        SampleTypeNumber = c.Int(nullable: false),
                        BatchNumber = c.Int(nullable: false),
                        InvoiceNumber = c.Int(nullable: false),
                        DateReported = c.Int(nullable: false),
                        PostageCost = c.Double(nullable: false),
                        Comments = c.String(),
                        CustomerDiscount = c.Double(nullable: false),
                        Locked = c.Byte(nullable: false),
                    })
                .PrimaryKey(t => new { t.CustomerNumber, t.SampleTypeNumber, t.BatchNumber });
            
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
                        BillToCompany = c.Int(nullable: false),
                        Discount = c.Double(nullable: false),
                        ActiveCustomer = c.Int(nullable: false),
                        Mailresults = c.Int(nullable: false),
                        MailedCopies = c.Int(nullable: false),
                        FaxResults = c.Int(nullable: false),
                        EmailResults = c.Int(nullable: false),
                        PostResultsToWeb = c.Int(nullable: false),
                        Newsletter = c.Int(nullable: false),
                        WardGuide = c.Int(nullable: false),
                        ChristmasCard = c.Int(nullable: false),
                        NamaCust = c.Int(nullable: false),
                        SendPDF = c.Int(nullable: false),
                        PrintPDFHeaderFooter = c.Int(nullable: false),
                        EPAInfo = c.Int(nullable: false),
                        PrintInvNow = c.Int(nullable: false),
                        PrintInvLater = c.Int(nullable: false),
                        SendInvoice = c.Int(nullable: false),
                        SendTextData = c.Int(nullable: false),
                        SplitGrowers = c.Int(nullable: false),
                        SplitFields = c.Int(nullable: false),
                        ExtraInformation = c.String(),
                        CustomerStatus = c.Int(nullable: false),
                        LastModified = c.DateTime(nullable: false),
                        MachineID = c.String(),
                        UserID = c.String(),
                        SampleEntryInformation = c.String(),
                        CreatedOn = c.DateTime(nullable: false),
                        ForceStandardSoilReport = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.CustomerNumber);
            
            AddColumn("dbo.SampleModels", "CustomerNumber", c => c.Int(nullable: false));
            AddColumn("dbo.InvoiceModels", "CustomerDiscount", c => c.Double(nullable: false));
            AddColumn("dbo.InvoiceModels", "CustomerNumber", c => c.Int(nullable: false));
            DropPrimaryKey("dbo.InvoiceModels");
            DropColumn("dbo.SampleModels", "AccountNumber");
            DropColumn("dbo.InvoiceModels", "AccountDiscount");
            DropColumn("dbo.InvoiceModels", "AccountNumber");
            DropTable("dbo.AccountModels");
            AddPrimaryKey("dbo.InvoiceModels", new[] { "InvoiceNumber", "CustomerNumber", "SampleTypeNumber", "BatchNumber" });
            RenameTable(name: "dbo.SampleChainModels", newName: "SoilSampleModels");
        }
    }
}
