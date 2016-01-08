namespace SampleData.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddedUnit : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.SoilRecCropModels", "Unit", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.SoilRecCropModels", "Unit");
        }
    }
}
