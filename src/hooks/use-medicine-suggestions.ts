
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useMedicineSuggestions = (searchQuery: string) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!searchQuery || searchQuery.length < 2) {
        setSuggestions([]);
        return;
      }

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('medicines')
          .select('name')
          .ilike('name', `%${searchQuery}%`)
          .order('name')
          .limit(10);

        if (error) {
          console.error('Error fetching medicine suggestions:', error);
          return;
        }

        setSuggestions(data.map(item => item.name));
      } catch (error) {
        console.error('Error in medicine suggestion query:', error);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  return { suggestions, loading };
};
