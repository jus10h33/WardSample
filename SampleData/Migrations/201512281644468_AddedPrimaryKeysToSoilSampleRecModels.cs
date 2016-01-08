namespace SampleData.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddedPrimaryKeysToSoilSampleRecModels : DbMigration
    {
        public override void Up()
        {
            DropTable("dbo.SoilSampleRecModels");
            CreateTable(
                "dbo.SoilSampleRecModels",
                c => new
                {
                    BatchNumber = c.Int(nullable: false),
                    LabNumber = c.Int(nullable: false),
                    Priority = c.Int(),
                    RecTypeNumber = c.Int(nullable: false),
                    CropTypeNumber = c.Int(nullable: false),
                    YieldGoal = c.Int(nullable: false),
                })
                .PrimaryKey(t => new { t.BatchNumber, t.LabNumber, t.RecTypeNumber, t.CropTypeNumber, t.YieldGoal });
        }
        
        public override void Down()
        {
            
        }
    }
}
