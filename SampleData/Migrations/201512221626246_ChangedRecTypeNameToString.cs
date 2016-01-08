namespace SampleData.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ChangedRecTypeNameToString : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.SoilRecTypeModels", "RecTypeName", c => c.String(nullable: false));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.SoilRecTypeModels", "RecTypeName", c => c.Int(nullable: false));
        }
    }
}
