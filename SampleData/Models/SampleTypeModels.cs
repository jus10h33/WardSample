using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace SampleData.Models
{
    public class SampleTypeModels
    {
        [Key]
        public int SampleTypeNumber { get; set; }
        public string SampleTypeName { get; set; }
    }
}