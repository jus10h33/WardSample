namespace SampleData.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class CostAndDateReported : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.SampleModels", "DateReported", c => c.DateTime(nullable: false));
            AddColumn("dbo.SampleModels", "CostTypeNumber", c => c.Int(nullable: false));
            DropColumn("dbo.SampleModels", "StandardCost");
        }
        
        public override void Down()
        {
            AddColumn("dbo.SampleModels", "StandardCost", c => c.Int(nullable: false));
            DropColumn("dbo.SampleModels", "CostTypeNumber");
            DropColumn("dbo.SampleModels", "DateReported");
        }
    }
}
