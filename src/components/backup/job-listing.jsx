// src/pages/job-listing.jsx
import { useEffect, useState } from 'react'
import useFetch from '@/hooks/use-fetch'
import { getJobs } from '@/api/apiJobs'
import { useUser } from '@clerk/clerk-react'
import { BarLoader } from 'react-spinners';
import JobCard from '@/components/job-card';

export default function JobListing() {

  const { isLoaded } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [company_id, setCompany_id] = useState("");




  const {
    data: jobs,
    loading: loadingJobs,
    error,
    fn: fnJobs,      // renamed for clarity
  } = useFetch(getJobs, {
    location,
    company_id,
    searchQuery,
  });


  // ⚡️ Depend on fetchJobs so it fires once on mount *and* again when
  // your useFetch hook gets a new Supabase client (i.e. session arrives).
  useEffect(() => {
    if (isLoaded) fnJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, location, company_id, searchQuery]);

  if (loadingJobs) return <p>Loading…</p>
  if (error) return <p>Error: {error.message}</p>


  if (!isLoaded) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div>
      <h1 className="gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8"> Latest Jobs
      </h1>

      {loadingJobs && (
        <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />
      )}
      {loadingJobs === false && (
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs?.length ? (
            jobs.map((job) => {
              return (
                <JobCard
                  key={job.id}
                  job={job}
                  savedInit={job?.saved?.length > 0}
                />
              );
            })
          ) : (
            <div>No Jobs Found 😢</div>
          )}
        </div>
      )}
    </div>

  )
}
