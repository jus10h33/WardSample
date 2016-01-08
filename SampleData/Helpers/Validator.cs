using SampleData.DAL;
using SampleData.Models;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;

namespace SampleData.Helpers
{
    public static class Validator
    {          
        //Validate numbers
        public static bool isNumeric(string num)
        {
            try
            {
                int x = Convert.ToInt32(num);
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        //Validate strings
        public static bool isPresent(string str)
        {
            if (str == "" || str == null || str.Equals(DBNull.Value))
            {
                return false;
            }
            return true;
        }        
    }
}