using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace SampleData.Models
{
	public class ReportReportItemModels
	{
        [Key]
        [Column(Order = 1)]
        [Required]
        public int SampleTypeNumber { get; set; }
        [Key]
        [Column(Order = 2)]
        public int ReportTypeNumber { get; set; }
        [Key]
        [Column(Order = 3)]
        public int ReportItemNumber { get; set; }
	}
}