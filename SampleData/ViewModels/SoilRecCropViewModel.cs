using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SampleData.ViewModels
{
    public class SoilRecCropViewModel
    {
        public int CropTypeNumber { get; set; }
        public string CropTypeName { get; set; }
        public string Unit { get; set; }
        public string CropTypeDisplay { get; set; }

        public SoilRecCropViewModel()
        {
            this.CropTypeNumber = 0;
            this.CropTypeName = "";
            this.Unit = "";
            this.CropTypeDisplay = CropTypeNumber + " - " + CropTypeName;
        }
    }
}