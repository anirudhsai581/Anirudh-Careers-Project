

// Fetch Companies
export async function getCompanies(supabase) {

  const { data, error } = await supabase.from("companies").select("*");

  if (error) {
    console.error("Error fetching Companies:", error);
    return null;
  }

  return data;
}

// Add Company
export async function addNewCompany(supabase, _options, { name, logo }) {

 const fileName = `logo-${Date.now()}-${name.replace(/\s+/g, "-")}`;

  const { error: storageError } = await supabase.storage
    .from("company-logo")
    .upload(fileName, logo);

  if (storageError) throw new Error("Error uploading Company Logo");
 // Get public URL (correctly destructured)
  const { data: urlData, error: urlError } = await supabase
    .storage
    .from("company-logo")
    .getPublicUrl(fileName);

  if (urlError) {
   console.error("Error getting public URL:", urlError);
    throw urlError;
  }

 const publicUrl = urlData.publicUrl;


  // Insert company data
  const { data, error } = await supabase
    .from("companies")
    .insert([
      {
       name,
       logo_url: publicUrl,
      },
    ])
    .select();

//   const {logo_url} =supabase.storage
//     .from("company-logo")
//     .getPublicUrl(fileName);

//   const { data, error } = await supabase
//     .from("companies")
//     .insert([
//       {
//         name: companyData.name,
//         logo_url: logo_url,
//       },
//     ])
//     .select();

  if (error) {
    console.error(error);
    throw new Error("Error submitting Companys");
  }

  return data;
}
