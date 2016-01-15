namespace SampleData.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddedSubTypes : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.SubSampleTypeModels",
                c => new
                {
                    SampleTypeNumber = c.Int(nullable: false),
                    SubSampleTypeNumber = c.Int(nullable: false),
                    SubSampleTypeName = c.String(nullable: false),
                })
                .PrimaryKey(t => new { t.SampleTypeNumber, t.SubSampleTypeNumber });

            CreateTable(
                "dbo.SubSubSampleTypeModels",
                c => new
                {
                    SampleTypeNumber = c.Int(nullable: false),
                    SubSampleTypeNumber = c.Int(nullable: false),
                    SubSubSampleTypeNumber = c.Int(nullable: false),
                    SubSubSampleTypeName = c.String(nullable: false),
                })
                .PrimaryKey(t => new { t.SampleTypeNumber, t.SubSampleTypeNumber, t.SubSubSampleTypeNumber });
        }
        
        public override void Down()
        {
        }
    }
}
