namespace SampleData.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddedModelColumn : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.SampleColumns", "Model", c => c.String(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.SampleColumns", "Model");
        }
    }
}
