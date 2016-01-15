using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SampleData.Models
{
    public class SubSampleTypeModels
    {
        [Key]
        [Column(Order = 1)]
        [Required]
        public int SampleTypeNumber { get; set; }
        [Key]
        [Column(Order = 2)]
        [Required]
        public int SubSampleTypeNumber { get; set; }
        public string SubSampleTypeName { get; set; }
    }
}