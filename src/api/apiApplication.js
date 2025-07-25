

// - Apply to job ( candidate )
export async function applyToJob(supabase, _, jobData) {


  const random = Math.floor(Math.random() * 90000);
  const fileName = `resume-${random}-${jobData.candidate_id}`;

  const { error: storageError } = await supabase.storage
    .from("resumes")
    .upload(fileName, jobData.resume);

  if (storageError) throw new Error("Error uploading Resume");

 
 // 3. Generate the public URL correctly
  const { data: { publicUrl }, error: urlError } = supabase.storage
    .from("resumes")
    .getPublicUrl(fileName);

  if (urlError || !publicUrl) {
    console.error("URL generation error:", urlError);
    throw new Error("Error generating resume URL");
  }

  const { data, error } = await supabase
    .from("applications")
    .insert([
      {
        ...jobData,
        resume:publicUrl
      },
    ])
    .select();

  if (error) {
    console.error(error);
    throw new Error("Error submitting Application");
  }

  return data;
}

// - Edit Application Status ( recruiter )
export async function updateApplicationStatus(supabase, { job_id }, status) {

  const { data, error } = await supabase
    .from("applications")
    .update({ status })
    .eq("job_id", job_id)
    .select();

  if (error || data.length === 0) {
    console.error("Error Updating Application Status:", error);
    return null;
  }

  return data;
}

export async function getApplications(supabase, { user_id }) {
 
  const { data, error } = await supabase
    .from("applications")
    .select("*, job:jobs(title, company:companies(name))")
    .eq("candidate_id", user_id);

  if (error) {
    console.error("Error fetching Applications:", error);
    return null;
  }

  return data;
}
