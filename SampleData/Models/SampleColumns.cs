using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SampleData.Models
{
    public class SampleColumns
    {
        [Key]
        [Column(Order = 1)]
        [Required]
        public int SampleTypeNumber { get; set; }
        public int ColumnOrder { get; set; }
        [Key]
        [Column(Order = 2)]
        [Required]
        public string Label { get; set; }
        [Required]
        public string Model { get; set; }
        public string ID { get; set; }
    }
}