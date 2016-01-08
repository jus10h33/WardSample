namespace SampleData.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ToResolveException : DbMigration
    {
        public override void Up()
        {
            DropTable("dbo.SoilSampleModels");
            DropTable("dbo.SoilRecTypeModels");
            DropTable("dbo.SoilRecCropModels");
            CreateTable(
                "dbo.SoilRecCropModels",
                c => new
                    {
                        CropTypeNumber = c.Int(nullable: false),
                        CropTypeName = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.CropTypeNumber);
            
            CreateTable(
                "dbo.SoilRecTypeModels",
                c => new
                    {
                        RecTypeNumber = c.Int(nullable: false),
                        RecTypeName = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.RecTypeNumber);
            
            CreateTable(
                "dbo.SoilSampleModels",
                c => new
                    {
                        BatchNumber = c.Int(nullable: false),
                        LabNumber = c.Int(nullable: false),
                        BeginningDepth = c.Int(nullable: false),
                        EndingDepth = c.Int(nullable: false),
                        PastCropNumber = c.Int(nullable: false),
                        LinkedSampleBatch = c.Int(nullable: false),
                        LinkedSampleLab = c.Int(nullable: false),
                        TopSoil = c.Int(nullable: false),
                    })
                .PrimaryKey(t => new { t.BatchNumber, t.LabNumber });
            
        }
        
        public override void Down()
        {
            DropTable("dbo.SoilSampleModels");
            DropTable("dbo.SoilRecTypeModels");
            DropTable("dbo.SoilRecCropModels");
        }
    }
}
