namespace SampleData.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ChangedYieldGoalToDouble : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.SoilSampleRecModels", "YieldGoal", c => c.Double(nullable: false));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.SoilSampleRecModels", "YieldGoal", c => c.Int(nullable: false));
        }
    }
}
