import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchGithubUser, searchGithubUser } from '../api/github';
import UserCard from './UserCard';
import RecentSearch from './RecentSearch';
import { useDebounce } from 'use-debounce';
import type { GithubUser } from '../types';
import SuggestionDropdown from './SuggestionDropdown';

const UserSearch = () => {
	const [username, setUsername] = useState('');
	const [submittedUsername, setSubmittedUsername] = useState('');
	const [recentUsers, setRecentUsers] = useState<string[]>(() => {
		const stored = localStorage.getItem('recentUsers');
		return stored ? JSON.parse(stored) : [];
	});
	const [debouncedUsername] = useDebounce(username, 300);
	const [showSuggestions, setShowSuggestions] = useState(false);

	// querty to fetch specific user when submittedUsername changes
	const { data, isLoading, isError, error, refetch } = useQuery({
		queryKey: ['user', submittedUsername],
		queryFn: async () => fetchGithubUser(submittedUsername),
		enabled: !!submittedUsername,
	});

	// query to fetch suggestions based on debouncedUsername
	const { data: suggestion } = useQuery({
		queryKey: ['github-user-suggestion', debouncedUsername],
		queryFn: async () => searchGithubUser(debouncedUsername),
		enabled: debouncedUsername.length > 1,
	});

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const trimed = username.trim();
		if (!trimed) return;
		setSubmittedUsername(trimed);
		setUsername('');

		setRecentUsers((prev) => {
			const updated = [trimed, ...prev.filter((u) => u !== trimed)];
			return updated.slice(0, 5);
		});
	};

	useEffect(() => {
		localStorage.setItem('recentUsers', JSON.stringify(recentUsers));
	}, [recentUsers]);

	return (
		<>
			<form className="form" onSubmit={handleSubmit}>
				<div className="dropdow-wrapper">
					<input
						type="text"
						placeholder="Enter Github Username..."
						value={username}
						onChange={(e) => {
							const value = e.target.value;
							setUsername(value);
							setShowSuggestions(value.trim().length > 1);
						}}
					/>
					{showSuggestions && suggestion?.length > 0 && (
						<SuggestionDropdown
							suggestions={suggestion}
							show={showSuggestions}
							onSelect={(selected) => {
								setUsername(selected);
								setShowSuggestions(false);

								if (submittedUsername !== selected) {
									setSubmittedUsername(selected);
								} else {
									refetch();
								}

								setRecentUsers((prev) => {
									const updated = [
										selected,
										...prev.filter((u) => u !== selected),
									];
									return updated.slice(0, 5);
								});
							}}
						/>
					)}
				</div>
				<button type="submit">Search</button>
			</form>

			{isLoading && <p className="status">Loading...</p>}
			{isError && <p className="status error">{error.message}</p>}

			{data && <UserCard user={data} />}
			{recentUsers.length > 0 && (
				<RecentSearch
					users={recentUsers}
					onSelect={(username) => {
						setUsername(username);
						setSubmittedUsername(username);
					}}
				/>
			)}
		</>
	);
};

export default UserSearch;
