using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SampleData.Models
{
    public class SoilRecTypeModels
    {
        [Key]
        [Required]
        [Column(Order = 1)]
        public int RecTypeNumber { get; set; }

        [Required]
        public string RecTypeName { get; set; }
    }
}