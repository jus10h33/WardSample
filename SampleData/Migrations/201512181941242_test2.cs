namespace SampleData.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class test2 : DbMigration
    {
        public override void Up()
        {
            //CreateTable(
            //    "dbo.SampleColumns",
            //    c => new
            //        {
            //            SampleTypeNumber = c.Int(nullable: false),
            //            Label = c.String(nullable: false, maxLength: 128),
            //            ColumnOrder = c.Int(nullable: false),
            //        })
            //    .PrimaryKey(t => new { t.SampleTypeNumber, t.Label });
            
        }
        
        public override void Down()
        {
            //DropTable("dbo.SampleColumns");
        }
    }
}
