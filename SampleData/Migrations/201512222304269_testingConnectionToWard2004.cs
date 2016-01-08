namespace SampleData.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class testingConnectionToWard2004 : DbMigration
    {
        public override void Up()
        {
            RenameTable(name: "dbo.OldSampleTable", newName: "w_Samples");
        }
        
        public override void Down()
        {
            RenameTable(name: "dbo.w_Samples", newName: "OldSampleTable");
        }
    }
}
