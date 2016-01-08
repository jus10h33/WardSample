using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SampleData.Models
{
    public class ReportItemTestModels
    {
        [Key]
        [Column(Order = 1)]
        [Required]
        public int SampleTypeNumber { get; set; }
        [Key]
        [Column(Order = 2)]
        public int ReportItemNumber { get; set; }
        [Key]
        [Column(Order = 3)]
        [Required]
        public int TestItemNumber { get; set; }
    }
}