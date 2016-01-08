namespace SampleData.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class addedSoilRecTables : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.SoilSampleModels",
                c => new
                {
                    BatchNumber = c.Int(nullable: false),
                    LabNumber = c.Int(nullable: false),
                    BeginningDepth = c.Int(),
                    EndingDepth = c.Int(),
                    PastCropNumber = c.Int(),
                    LinkedSampleBatch = c.Int(),
                    LinkedSampleLab = c.Int(),
                    TopSoil = c.Int(),
                })
                .PrimaryKey(t => new { t.BatchNumber, t.LabNumber });

            CreateTable(
                "dbo.SoilRecTypeModels",
                c => new
                {
                    RecTypeNumber = c.Int(nullable: false),
                    RecTypeName = c.String(nullable: false),                    
                })
                .PrimaryKey(t => new {
                    t.RecTypeNumber
                });

            CreateTable(
                "dbo.SoilRecCropModels",
                c => new
                {
                    CropTypeNumber = c.Int(nullable: false),
                    CropTypeName = c.String(nullable: false),
                })
                .PrimaryKey(t => new {
                    t.CropTypeNumber
                });
        }      

        
        public override void Down()
        {
        }
    }
}
