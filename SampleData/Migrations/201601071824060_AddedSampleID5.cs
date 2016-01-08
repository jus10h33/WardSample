namespace SampleData.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddedSampleID5 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.SampleModels", "SampleID5", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.SampleModels", "SampleID5");
        }
    }
}
