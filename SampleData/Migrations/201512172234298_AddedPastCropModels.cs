namespace SampleData.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddedPastCropModels : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.PastCropModels",
                c => new
                    {
                        PastCropNumber = c.Int(nullable: false),
                        PastCropName = c.String(),
                        NitrogenCredit = c.Double(),
                    })
                .PrimaryKey(t => t.PastCropNumber);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.PastCropModels");
        }
    }
}
