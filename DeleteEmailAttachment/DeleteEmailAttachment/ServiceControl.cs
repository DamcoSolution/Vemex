using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using CRM;
using Microsoft.Xrm.Sdk;

namespace DeleteEmailAttachment
{
    public static class ServiceControl
    {
        public static IOrganizationService ServiceInstance = null;
        public static IOrganizationService GetService()
        {

            // get crm credentials
            string email = ConfigurationManager.AppSettings["crmEmail"];
            string password = ConfigurationManager.AppSettings["crmPassword"];
            string domain = ConfigurationManager.AppSettings["crmDomain"];

            // login to crm
            if (ServiceInstance == null)
                ServiceInstance = Service.Authentication(email, password, domain);

            // return servie from session
            return ServiceInstance;
        }
    }
}
