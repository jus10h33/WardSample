using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace SampleData.Models
{
    public class ReportItemModels
    {
        [Key]
        [Column(Order = 1)]
        [Required]
        public int SampleTypeNumber { get; set; }
        [Key]
        [Column(Order = 2)]
        [Required]
        public int ReportItemNumber { get; set; }
        public string ReportItemName { get; set; }
        public string ReportItemDisplay { get; set; }
        public double ReportItemCost { get; set; }
        public int EquationNumber { get; set; }
        public int ReportItemDecimals { get; set; }
        public double MinimumValue { get; set; }
        public int ReportOrder { get; set; }
    }
}