namespace SampleData.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddedIDColumn : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.SampleColumns", "ID", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.SampleColumns", "ID");
        }
    }
}
