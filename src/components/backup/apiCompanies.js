

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
export async function addNewCompany(supabase, _, companyData) {

  const random = Math.floor(Math.random() * 90000);
  const fileName = `logo-${random}-${companyData.name}`;

  const { error: storageError } = await supabase.storage
    .from("company-logo")
    .upload(fileName, companyData.logo);

  if (storageError) throw new Error("Error uploading Company Logo");
   // Get public URL
  const { publicUrl } = supabase.storage
    .from("company-logo")
    .getPublicUrl(fileName);

  // Insert company data
  const { data, error } = await supabase
    .from("companies")
    .insert([
      {
        name: companyData.name,
        logo_url: publicUrl,  // ← now auto-generated
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
