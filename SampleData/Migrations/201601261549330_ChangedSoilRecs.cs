namespace SampleData.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ChangedSoilRecs : DbMigration
    {
        public override void Up()
        {
            RenameTable(name: "dbo.SoilSampleRecModels", newName: "SoilRecModels");
        }
        
        public override void Down()
        {
            RenameTable(name: "dbo.SoilRecModels", newName: "SoilSampleRecModels");
        }
    }
}
