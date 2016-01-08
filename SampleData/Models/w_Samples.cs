using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace SampleData.Models
{
    public class w_Samples
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
        public int DateReceived { get; set; }
        public int ReportTypeNumber { get; set; }
        public double ReportCost { get; set; }
        [Required]
        public string ResultsFor { get; set; }
        [Required]
        public string SampleID1 { get; set; }
        public string SampleID2 { get; set; }
        public string SampleID3 { get; set; }
        public string SampleID4 { get; set; }
        public int Reviewed { get; set; }
        public int Emailed { get; set; }
        public int Uploaded { get; set; }
        public int Faxed { get; set; }
        public int Hold { get; set; }
        public int StandardCost { get; set; }
        public int Status { get; set; }
        public DateTime LastModified { get; set; }
        public int ReviewerID { get; set; }
    }
}