namespace SampleData.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class fix2 : DbMigration
    {
        public override void Up()
        {
            //CreateTable(
            //    "dbo.SubSampleInfoModels",
            //    c => new
            //        {
            //            SampleTypeNumber = c.Int(nullable: false),
            //            BatchNumber = c.Int(nullable: false),
            //            LabNumber = c.Int(nullable: false),
            //            SubSampleTypeNumber = c.Int(nullable: false),
            //            SubSubSampleTypeNumber = c.Int(nullable: false),
            //        })
            //    .PrimaryKey(t => new { t.SampleTypeNumber, t.BatchNumber, t.LabNumber });
            
        }
        
        public override void Down()
        {
            //DropTable("dbo.SubSampleInfoModels");
        }
    }
}
