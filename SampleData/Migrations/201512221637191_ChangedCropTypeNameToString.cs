namespace SampleData.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ChangedCropTypeNameToString : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.SoilRecCropModels", "CropTypeName", c => c.String(nullable: false));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.SoilRecCropModels", "CropTypeName", c => c.Int(nullable: false));
        }
    }
}
