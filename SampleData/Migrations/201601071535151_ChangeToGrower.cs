namespace SampleData.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ChangeToGrower : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.SampleModels", "Grower", c => c.String(nullable: false));
            DropColumn("dbo.SampleModels", "ResultsFor");
        }
        
        public override void Down()
        {
            AddColumn("dbo.SampleModels", "ResultsFor", c => c.String(nullable: false));
            DropColumn("dbo.SampleModels", "Grower");
        }
    }
}
