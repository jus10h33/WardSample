using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SampleData.Models
{
    public class SubSubSampleTypeModels
    {
        [Key]
        [Column(Order = 1)]
        [Required]
        public int SampleTypeNumber { get; set; }
        [Key]
        [Column(Order = 2)]
        [Required]
        public int SubSampleTypeNumber { get; set; }
        [Key]
        [Column(Order = 3)]
        [Required]
        public int SubSubSampleTypeNumber { get; set; }
        public string SubSubSampleTypeName { get; set; }
    }
}