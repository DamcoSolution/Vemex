using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using CreativeMages.Xrm;
using Microsoft.Xrm.Sdk;

namespace DeleteEmailAttachment
{
    class Program
    {
        static void Main(string[] args)
        {
            try
            {

                using (XrmContext context = new XrmContext(ServiceControl.GetService()))
                {
                    Console.WriteLine("Connection established Succefully");
                    StringBuilder Filenames = new StringBuilder();
                    var Emails = context.EmailSet.Where(lst => (lst.StatusCode == new OptionSetValue((int)email_statuscode.Received) || lst.StatusCode == new OptionSetValue((int)email_statuscode.Sent))).ToList();
                    foreach (Email email in Emails)
                    {
                        ////email.email_activity_mime_attachment
                        //if (email.Attributes.Contains("activity_mime_attachment") && email.email_activity_mime_attachment != null && email.email_activity_mime_attachment.ToList().Count > 0)
                        //{
                        var Attachments = context.ActivityMimeAttachmentSet.Where(lst => lst.ObjectId == new EntityReference(Email.EntityLogicalName, email.Id)).ToList();
                        if (Attachments != null && Attachments.Count > 0)
                        {
                            Console.WriteLine("Email : " + email.Id.ToString());
                            Console.WriteLine("Email Subject : " + email.Subject);
                            
                            foreach (ActivityMimeAttachment attachement in Attachments)
                            {
                                Filenames.AppendLine(attachement.FileName);
                                context.DeleteObject(attachement);
                            }
                            Annotation anotation = new Annotation();
                            anotation.Subject = "Deleted Attachments";
                            anotation.NoteText = Filenames.ToString();
                            anotation.ObjectId = email.ToEntityReference();
                            context.AddObject(anotation);
                            context.SaveChanges();
                        }
                        //}
                    }
                    Console.WriteLine("Code Executed Successfully");
                    Console.ReadLine();
                }
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
                Console.ReadLine();
            }
        }
    }
}
