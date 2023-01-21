CREATE OR REPLACE VIEW "public"."mad_feed_post_vote_sums" AS 
  SELECT mad_feed_posts.post_id,
    COALESCE(sum(mad_feed_votes.value), (0)::numeric) AS total,
    COALESCE(( SELECT sum(mad_feed_votes_1.value) AS sum
        FROM auth.mad_feed_votes mad_feed_votes_1
        WHERE ((mad_feed_posts.post_id = mad_feed_votes_1.post_id) AND (mad_feed_votes_1.type = 'VOTE'::text))
        GROUP BY mad_feed_posts.post_id), (0)::numeric) AS votes,
    COALESCE(( SELECT sum(mad_feed_votes_1.value) AS sum
        FROM auth.mad_feed_votes mad_feed_votes_1
        WHERE ((mad_feed_posts.post_id = mad_feed_votes_1.post_id) AND (mad_feed_votes_1.type = 'BACKPACK'::text))
        GROUP BY mad_feed_posts.post_id), (0)::numeric) AS backpack,
    COALESCE(count(mad_feed_votes.value), (0)::numeric) AS total_count,
    COALESCE(( SELECT count(mad_feed_votes_1.value) AS count
        FROM auth.mad_feed_votes mad_feed_votes_1
        WHERE ((mad_feed_posts.post_id = mad_feed_votes_1.post_id) AND (mad_feed_votes_1.type = 'VOTE'::text))
        GROUP BY mad_feed_posts.post_id), (0)::numeric) AS votes_count,
    COALESCE(( SELECT count(mad_feed_votes_1.value) AS count
        FROM auth.mad_feed_votes mad_feed_votes_1
        WHERE ((mad_feed_posts.post_id = mad_feed_votes_1.post_id) AND (mad_feed_votes_1.type = 'BACKPACK'::text))
        GROUP BY mad_feed_posts.post_id), (0)::numeric) AS backpack_count
   FROM (auth.mad_feed_posts
     LEFT JOIN auth.mad_feed_votes ON ((mad_feed_posts.post_id = mad_feed_votes.post_id)))
  GROUP BY mad_feed_posts.post_id, mad_feed_votes.post_id;