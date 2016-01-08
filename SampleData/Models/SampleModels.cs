using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SampleData.Models
{
    public class SampleModels
    {
        [Key]
        [Column(Order = 1)]
        [Required]
        public int SampleTypeNumber { get; set; }
        [Key]
        [Column(Order = 2)]
        [Required]
        public int BatchNumber { get; set; }
        [Key]
        [Column(Order = 3)]
        [Required]
        public int LabNumber { get; set; }
        [Required]
        public int CustomerNumber { get; set; }
        [Required]
        public int InvoiceNumber { get; set; }
        [Required]
        public DateTime DateReceived { get; set; }
        public int ReportTypeNumber { get; set; }
        public double ReportCost { get; set; }
        [Required]
        public string Grower { get; set; }
        [Required]
        public string SampleID1 { get; set; }
        public string SampleID2 { get; set; }
        public string SampleID3 { get; set; }
        public string SampleID4 { get; set; }
        public string SampleID5 { get; set; }
        public int Reviewed { get; set; }
        public int Emailed { get; set; }
        public int Uploaded { get; set; }
        public int Faxed { get; set; }
        public int Hold { get; set; }
        public int StandardCost { get; set; }
        public int Status { get; set; }
        public DateTime LastModified { get; set; }
        public int ReviewerID { get; set; }
        public SampleModels()
        {
            //this.ReportCost = 0.0;
            this.ReportTypeNumber = 0;
            this.ReviewerID = 0;
            this.Emailed = 0;
            this.Reviewed = 0;
            this.Uploaded = 0;
            this.Faxed = 0;
            this.Hold = 0;
            this.Status = 0;
            this.InvoiceNumber = 0;
            this.LastModified = DateTime.Now;
        }      
    }
}